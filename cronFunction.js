var orderheaderInstance = require('./models/orderheaderInstance.js');
var orderdetailInstance = require('./models/orderdetailInstance.js');
var orderimageInstance = require('./models/orderimageInstance.js');
var productInstance = require('./models/productInstance.js');
var discountcouponInstance = require('./models/discountcouponInstance.js');
var userInstance = require('./models/userInstance.js');
var resellerInstance = require('./models/resellerInstance.js');
var emailInstance = require('./models/emailInstance.js');
var stockbalanceController = require('./controllers/stockbalanceController.js');
var orderstatushistoryController = require('./controllers/orderstatushistoryController.js');
var email = require('./controllers/emailController.js');
var queryFunction = require('./config/queryFunction.js');
var emailFunction = require('./config/emailFunction');
var fileFunction = require('./config/fileFunction');

exports.cancelExpiredOrder = () => {
    let date = new Date();
    date.setHours(date.getHours() - 30);

    let expired_time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':00';

    orderheaderInstance.expiredOrders(expired_time,(results) => {
        results = queryFunction.checkSelectResult(results);

        if(results.result){
            let orders = results.data;

            for(let order of orders){

                //balikin diskon kupon kalau ada
                if(order.discountcoupon_id > 0){
                    discountcouponInstance.discountcoupon({id: order.discountcoupon_id}, (results) => {
                        results = queryFunction.checkSelectResult(results);

                        if(results.result){
                            let discountcoupon = results.data[0];

                            let data_dc = {
                                id: discountcoupon.id,
                            }

                            discountcouponInstance.increaseCoupon(data_dc);
                        }
                    });
                }


                //set status jadi batal otomatis
                let data_order = {
                    id: order.id,
                }
                orderheaderInstance.cancelSystem(data_order);

                //save ke history order
                orderstatushistoryController.saveOrderStatus(order.id, order.status_id, 17, 1);


                //loop detailnya
                orderdetailInstance.orderdetails(data_order, (results) => {
                    results = queryFunction.checkSelectResult(results);

                    if(results.result){
                        let details = results.data;

                        for(let detail of details){
                            //balikin stok produk satuan

                            //ambil produk dan qty nya
                            productInstance.product({id: detail.product_id}, (results) => {
                                results = queryFunction.checkSelectResult(results);

                                if(results.result){
                                    let product = results.data[0];

                                    //masukin stok balance
                                    let stock_in = detail.qty;
                                    let stock_out = 0;
                                    let current_qty = product.qty;

                                    let data_stock_balance = {
                                        product_id: product.id,
                                        stock_in: stock_in,
                                        stock_booked: 0,
                                        stock_out: stock_out,
                                        notes: 'Balik stok dari Pembatalan Otomatis Invoice: ' + order.invoicenumber
                                    }
                                    stockbalanceController.addBalance(data_stock_balance);

                                    //balikin stok
                                    productInstance.updateQty({id: product.id, qty: product.qty + detail.qty}, (results) => {});
                                }
                            });

                        }
                    }
                });


                //kirim email batal ke customer
                userInstance.user({id:order.user_id}, (results) => {
                    results = queryFunction.checkSelectResult(results);

                    if(results.result){
                        let user = results.data[0];

                        //kirim email
                        let to = user.email;
                        let subject = 'Pemesanan Anda dibatalkan';
                        let text = '';

                        emailInstance.first((results) => {
                          results = queryFunction.checkSelectResult(results);

                          if(results.result){
                            let email_data = results.data[0];

                            text = email_data.cancel_order + ' Invoice: ' + order.invoicenumber;
                            if(text.length > 0){
                              email.sendEmail(to, subject, text);
                            }
                          }
                        });
                    }
                })

            }
        }
    })
}

exports.changeUserStatus = () => {
    //ambil user yang belum di upgrade hari ini
    userInstance.userForUpgrade((results) => {
        results = queryFunction.checkSelectResult(results);

        if(results.result){
            let users = results.data;

            //ambil config
            resellerInstance.first((results) => {
                results = queryFunction.checkSelectResult(results);

                if(results.result){
                    let config = results.data[0];

                    for(let user of users){
                        //ambil totalan belanja masing-masing user
                        let upgrade_days = 0;
                        let downgrade_days = 0;
                        let upgrade_nominal = 0;
                        let downgrade_nominal = 0;
                        let status_upgrade = 1;
                        let status_downgrade = 1;

                        switch (user.status_id) {
                            case 1:
                                upgrade_days = config.silver_upgrade_days;
                                downgrade_days = 0;
                                upgrade_nominal = config.silver_min_upgrade;
                                downgrade_nominal = 0;
                                status_upgrade = 2;
                                status_downgrade = 1;
                                break;
                            case 2:
                                upgrade_days = config.gold_upgrade_days;
                                downgrade_days = config.silver_downgrade_days;
                                upgrade_nominal = config.gold_min_upgrade;
                                downgrade_nominal = config.silver_min_downgrade;
                                status_upgrade = 3;
                                status_downgrade = 1;
                                break;
                            case 3:
                                upgrade_days = config.platinum_upgrade_days;
                                downgrade_days = config.gold_downgrade_days;
                                upgrade_nominal = config.platinum_min_upgrade;
                                downgrade_nominal = config.gold_min_downgrade;
                                status_upgrade = 4;
                                status_downgrade = 2;
                                break;
                            case 4:
                                upgrade_days = 0;
                                downgrade_days = config.platinum_downgrade_days;
                                upgrade_nominal = 0;
                                downgrade_nominal = config.platinum_min_downgrade;
                                status_upgrade = 4;
                                status_downgrade = 3;
                                break;
                            default:
                        }

                        let data = {
                            user_id: user.id
                        }

                        //UPGRADE
                        let data_upgrade = {
                            id: user.id,
                            status_id: user.status_id,
                        }
                        if(upgrade_days > 0){
                            let start_date = new Date();
                            start_date.setDate(start_date.getDate() - upgrade_days);
                            data.start_date = start_date;

                            orderheaderInstance.calculateGrandTotal(data, (results) => {
                                results = queryFunction.checkSelectResult(results);

                                if(results.result){
                                    let grand_total = 0;

                                    if(results.data[0].total){
                                        grand_total = results.data[0].total;
                                    }

                                    //kalau belanja lebih besar dari nominal upgrade
                                    if(grand_total >= upgrade_nominal){
                                        data_upgrade.status_id = status_upgrade;
                                        userInstance.updateUserstatus(data_upgrade);
                                    } else {
                                        userInstance.updateUserstatus(data_upgrade);
                                    }
                                }
                            })
                        } else {
                            userInstance.updateUserstatus(data_upgrade);
                        }

                        //DOWNGRADE
                        let data_downgrade = {
                            id: user.id,
                            status_id: user.status_id,
                        }
                        if(downgrade_days > 0){
                            let start_date = new Date();
                            start_date.setDate(start_date.getDate() - downgrade_days);
                            data.start_date = start_date;

                            orderheaderInstance.calculateGrandTotal(data, (results) => {
                                results = queryFunction.checkSelectResult(results);

                                if(results.result){
                                    let grand_total = 0;

                                    if(results.data[0].total){
                                        grand_total = results.data[0].total;
                                    }

                                    //kalau belanja lebih kecil dari nominal downgrade
                                    if(grand_total <= downgrade_nominal){
                                        data_downgrade.status_id = status_downgrade;
                                        userInstance.updateUserstatus(data_downgrade);
                                    }else {
                                        userInstance.updateUserstatus(data_downgrade);
                                    }


                                }
                            })
                        }else {
                            userInstance.updateUserstatus(data_downgrade);
                        }

                    }

                }
            });

        }
    })
}

exports.calculateStockBookSold = () => {
    productInstance.products({}, (results) => {
        results = queryFunction.checkSelectResult(results);

        if(results.result){
            let products = results.data;

            let one_month = new Date();
            one_month.setDate(one_month.getDate() - 30);
            one_month = one_month.getFullYear() + '-' + ('0' + (one_month.getMonth()+1)).slice(-2) + '-' + ('0' + one_month.getDate()).slice(-2);

            for(let product of products){

                //update stock booked
                productInstance.updateStockBooked({id: product.id});

                //update stock sold
                productInstance.updateStockSold({id: product.id}, one_month);
            }
        }
    });
}

exports.calculateProductSetStock = () => {
    productInstance.productsets((results) => {
        results = queryFunction.checkSelectResult(results);

        if(results.result){
            let productsets = results.data;

            for(let set of productsets){
                let data = {
                    set_id: set.id,
                }
                //ambil produk paketannya semua
                productInstance.productsetslist(data, (results) => {
                    results = queryFunction.checkSelectResult(results);

                    if(results.result){
                        let products = results.data;

                        //ambil qty terkecil
                        let smallest_qty = null;
                        for(let product of products){
                            if(smallest_qty == null){
                                smallest_qty = product.qty;
                            }else {
                                if(smallest_qty > product.qty){
                                    smallest_qty = product.qty;
                                }
                            }
                        }

                        //update qty product set jadi yang terkecil
                        if(smallest_qty != set.qty){
                            data.qty = smallest_qty;
                            productInstance.updateSetQty(data);

                            //save ke stok balance.
                            let stock_in = 0;
                            let stock_out = 0;
                            if(set.qty > smallest_qty){
                                stock_out = set.qty - smallest_qty;
                            }else {
                                stock_in = smallest_qty - set.qty;
                            }
                            let data_stock_balance = {
                                product_id: set.id,
                                stock_in: stock_in,
                                stock_booked: 0,
                                stock_out: stock_out,
                                notes: 'Perubahan otomatis produk paket sesuai stok terkecil.'
                            }
                            stockbalanceController.addBalance(data_stock_balance);
                        }
                    }
                })

            }
        }
    });
}

exports.removeOldImages = () => {

  let start_date = new Date();
  start_date.setDate(start_date.getDate() - 30);
  start_date = start_date.getFullYear() + '-' + ('0' + (start_date.getMonth()+1)).slice(-2) + '-' + ('0' + start_date.getDate()).slice(-2);

  console.log(`Working on Removing Older Image`);
  console.log(start_date);

  orderimageInstance.oldOrderImages(start_date, (results) => {
    results = queryFunction.checkSelectResult(results)

    if (results.result) {
      let images = results.data

      for (let image of images) {
        console.log(image.image_path);
        fileFunction.deleteFile(image.image_path)

      }
      orderimageInstance.deleteImage(start_date)
    }
  })

}
