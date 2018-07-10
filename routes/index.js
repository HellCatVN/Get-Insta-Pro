var express = require('express');
var urlMetadata = require('url-metadata')
var request = require('request');
var JSSoup = require("jssoup").default;

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("index");
});
router.get('/get.html', function(req, res, next) {
  if (req.query.url) {
    request(req.query.url, function(error, response, body) {
      console.log("error:", error);
      if (error == null) {
        if (response.statusCode == 200) {
          var soup = new JSSoup(body);
          allmeta = soup.findAll("meta");
          var img_url = "";
          var video_url = "";
          allmeta.forEach(element => {
            if (element.attrs.property == "og:image") {
              img_url = element.attrs.content;
            } else if (element.attrs.property == "og:video") {
              video_url = element.attrs.content;
            }
          });
          if (video_url != "") {
            res.json({
              messages: [
                {
                  attachment: {
                    type: "video",
                    payload: {
                      url: video_url
                    }
                  }
                }
              ]
            });
          } else if (img_url != "") {
            res.json({
              messages: [
                {
                  attachment: {
                    type: "image",
                    payload: {
                      url: img_url
                    }
                  }
                }
              ]
            });
          } else {
            res.json({
              messages: [{ text: "URL bạn nhập có vẻ không hợp lệ!" }]
            });
          }
        } else {
          res.json({
            messages: [
              { text: "Ảnh Hoặc Video Cần Tải Đang Ở Chế Độ Private!" }
            ]
          });
        }
      } else {
        res.json({ messages: [{ text: "Lỗi Không Xác Định!" }] });
      }
    });
  } else {
    res.json({ error: 404 });
  }
});
router.post('/get.html', function(req, res, next) {
  request(req.body.url, function(error, response, body) {
    console.log("error:", error);
    if (error == null) {
      if (response.statusCode == 200) {
        var soup = new JSSoup(body);
        allmeta = soup.findAll("meta");
        var img_url = "";
        var video_url = "";
        allmeta.forEach(element => {
          if (element.attrs.property == "og:image") {
            img_url = element.attrs.content;
          } else if (element.attrs.property == "og:video") {
            video_url = element.attrs.content;
          }
        });
        if (video_url != "") {
          result = {
            status : "success",
            type : "video",
            video_url : video_url,
          }
          res.render("result",result)
        } else if (img_url != "") {
          result = {
            status : "success",
            type : "image",
            image_url : img_url,
          }
          res.render("result",result)         
        } else {
          result = {
            status : "fail",
            messages : "URL bạn nhập có vẻ không hợp lệ!",
          }
          res.render("result",result)  
        }
      } else {
        result = {
          status : "fail",
          messages : "Ảnh Hoặc Video Cần Tải Đang Ở Chế Độ Private!",
        }
        res.render("result",result)  
      }
    } else {
      result = {
        status : "fail",
        messages : "Lỗi Không Xác Định!",
      }
      res.render("result",result)        
    }
  });
});

module.exports = router;
