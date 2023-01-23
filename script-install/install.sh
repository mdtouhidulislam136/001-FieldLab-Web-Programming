#!/bin/bash
###########################################################################
#                                                                         #
#	FIELDLAB INSTALLATION SCRIPT v1.0 (02-06-2020)                    #
#       SUDO VERSION                                                      #
#                                                                         #
#       This scipt will install the current version of FieldLab           #
#       environment on gitlab virtualmachine. The installation            #
#       is done in accordance with the project's documentation.           #
#                                                                         #
###########################################################################

#FUNCTIONS
function enterIP() {
  while true;
    do
        read -p "Enter the IP of your virtual machine: " URL
        echo "${URL}" > ip.txt
        OCT1=$(cat ip.txt | awk -F "." '{print $1}')
        OCT2=$(cat ip.txt | awk -F "." '{print $2}')
        OCT3=$(cat ip.txt | awk -F "." '{print $3}')
        OCT4=$(cat ip.txt | awk -F "." '{print $4}')
        REGEX_IP='^[0-9]{1,3}[.][0-9]{1,3}[.][0-9]{1,3}[.][0-9]{1,3}$'
        if [[ ${URL} =~ ${REGEX_IP} ]]
        then
        if [[ ${OCT1} -gt 255 || ${OCT2} -gt 255 || ${OCT3} -gt 255 || ${OCT4} -gt 255 ]]
        then
                echo "Please enter a valid IP"
        continue
        fi

   break
   else
        echo "Please enter a valid IP"
        continue
  fi
  done
}
echo "Updating the system"
sudo apt update
sudo apt -y upgrade
clear
enterIP
echo
echo "***************************************************************************"
echo "*"
echo "* Default system settings are:"
echo "* IP: $URL"
echo "* Database::name:         test_db"
echo "* Database::table_name    robottidata"
echo "* Database::user_name     postgres"
echo "* Database::password      Robotti123"
echo "* Database::port          5432"
echo "*"
echo "***************************************************************************"
echo
echo
echo "**********************************************************************"
echo "*"
echo "*            INSTALLING THE POSTGRESQL AND PHPPGADMIN"
echo "*"
echo "**********************************************************************"
sudo apt install postgresql postgresql-client
echo
echo "Copying over modified pg_hba.conf."
sudo cp pg_hba.conf /etc/postgresql/12/main/pg_hba.conf
echo "Copying over modified postgresql.conf"
sudo cp postgresql.conf /etc/postgresql/12/main/postgresql.conf
echo "Restarting PostGreSQL."
sudo systemctl restart postgresql
postgreSuccess=$(sudo systemctl status postgresql)
echo "$postgreSuccess"
echo
echo "Creating the database and table."
sudo -u postgres psql postgres < schema.sql
echo
echo "Installing phpPgAdmin."
sudo apt install phppgadmin
echo "Copying over modified phppgadmin.conf."
sudo cp phppgadmin.conf /etc/apache2/conf-available/phppgadmin.conf
echo "Disabling extra login security..."
sudo sed -i 's#$conf['extra_login_security'] = true;#$conf['extra_login_security'] = false;#g' /etc/phppgadmin/config.inc.php
echo
echo "*************************************************************************"
echo "*   To test the database and phpPgAdmin visit your virtual servers ip:"
echo "*"
echo "*   http://$URL/phppgadmin/"
echo "*"
echo "*************************************************************************"
echo
echo
echo "************************************************************************"
echo "*"
echo "*                        INSTALLING GRAFANA"
echo "*"
echo "************************************************************************"
echo
sudo apt-get install -y gnupg2 curl  software-properties-common
sudo add-apt-repository "deb https://packages.grafana.com/oss/deb stable main"
sudo apt-get -y install grafana
sudo systemctl enable --now grafana-server
echo
echo "*************************************************************************"
echo "*         To test the Grafana visit your virtual servers ip:"
echo "*"
echo "*         http://$URL:3000"
echo "*"
echo "*************************************************************************"
echo
echo
echo "*************************************************************************"
echo "*"
echo "*                      INSTALLING NODE, API, PM2"
echo "*"
echo "*************************************************************************"
sudo apt install nodejs
nodejs -v
sudo apt install npm
echo "Modifying API database config..."
pushd ../node-back/app/config
sed -i "s#172.16.101.131#${URL}#g" db.config.js
popd
echo "Modifying API controller config"
pushd ../node-back/app/controllers
sed -i "s#172.16.101.131#${URL}#g" robot.controller.js
popd
echo
pushd ../node-back
npm install
echo "Installing PM2 and adding API."
npm install pm2 -g
pm2 start start.js
popd
echo
echo "*************************************************************************"
echo "*          To test the API visit your virtual servers ip:"
echo "*"
echo "*          http://$URL:8080"
echo "*"
echo "*	 	REMEMBER TO RUN THE pm2 startup SCRIPT IN THE SHELL"
echo "*		AND FOLLOW THE INSTRUCTIONS TO ADD PM2 AS DAEMON."
echo "*         SEE DOCUMENTATION PAGE 38."
echo "*"
echo "*************************************************************************"
echo 
echo
echo "*************************************************************************"
echo "*"
echo "*                    INSTALLING REACT FRONT-END"
echo "*"
echo "*************************************************************************"
echo 
echo "Modifying the DataContext.js file"
echo
pushd ../react-front/src/contexts
sed -i "s#172.16.101.131#${URL}#g" DataContext.js #replace with the correct file name
popd
echo "Installing the front-end"
echo
pushd ../react-front
npm install
echo "Running build."
npm run build
popd
pushd ../react-front/build
echo "Copying files to Apache and restarting Apache."
sudo cp -r * /var/www/html
popd
sudo systemctl restart apache2.service
echo "*************************************************************************"
echo "*"
echo "*      To view the build, open your browser to:"
echo "*      http://$URL"
echo "*"
echo "*      For testing purposes, you should run the development"
echo "*      environment through node (Documentation page 39)."
echo "*"
echo "*************************************************************************"
echo
echo "You're done."

