cd ../react-front/src/contexts/
sed -i 's#http://172.16.101.131:8080/api/robots/names#nodeapi:8081/api/robots/names#g' DataContext.js
sed -i 's#http://172.16.101.131:8080/api/robots#nodeapi:8081/api/robots#g' DataContext.js
cd ../node-back/app/config/
sed -i 's#HOST = "172.16.101.131"#HOST = "db"#g' db.config.js
cd ../controllers
sed -i 's#host: '172.16.101.131'#host: 'db'#g' robot.controller.js
