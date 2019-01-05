#! /bin/bash

git clone -b ungrad2019 https://github.com/rgwch/elexis-3-core
git clone -b ungrad2019 https://github.com/rgwch/elexis-3-base
git clone -b ungrad2019 https://github.com/rgwch/elexis-ungrad
git clone https://github.com/rgwch/Lucinda

cd elexis-3-core
mvn clean verify -Dtycho.localArtifacts=ignore -Dmaven.test.skip=true -P all-archs 
cd ../elexis-3-base 
mvn clean verify -Dtycho.localArtifacts=ignore -Dmaven.test.skip=true 
cd ../elexis-ungrad
mvn clean verify
cd ../Lucinda/lucinda-server
mvn clean package

