#! /bin/bash

git clone -b ungrad2019 https://github.com/rgwch/elexis-3-core
git clone -b ungrad2019 https://github.com/rgwch/elexis-3-base
git clone -b ungrad2019 https://github.com/rgwch/elexis-ungrad
git clone https://github.com/rgwch/Lucinda

cd elexis-3-core
mvn clean verify 
cd ../elexis-3-base 
mvn clean verify
cd ../elexis-ungrad
mvn clean verify
cd ../Lucinda
mvn clean package

