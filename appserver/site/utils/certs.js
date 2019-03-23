const forge = require('node-forge')


const createSelfSignedKeys = (sitename) => {
    var pki = forge.pki;

    // generate a keypair and create an X.509v3 certificate
    var keys = pki.rsa.generateKeyPair(2048);
    var cert = pki.createCertificate();
    cert.publicKey = keys.publicKey;
    cert.serialNumber = '01';
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
    var attrs = [{
        name: 'commonName',
        value: sitename
    }, {
        name: 'countryName',
        value: 'CH'
    }, {
        shortName: 'ST',
        value: 'Elexikon'
    }, {
        name: 'localityName',
        value: 'Webelexikon'
    }, {
        name: 'organizationName',
        value: 'Webelexis'
    }, {
        shortName: 'OU',
        value: 'SelfSigned'
    }];
    cert.setSubject(attrs);
    cert.setIssuer(attrs);
    cert.setExtensions([{
        name: 'basicConstraints',
        cA: true
    }, {
        name: 'keyUsage',
        keyCertSign: true,
        digitalSignature: true,
        nonRepudiation: true,
        keyEncipherment: true,
        dataEncipherment: true
    }, {
        name: 'extKeyUsage',
        serverAuth: true,
        clientAuth: true,
        codeSigning: true,
        emailProtection: true,
        timeStamping: true
    }, {
        name: 'nsCertType',
        client: true,
        server: true,
        email: true,
        objsign: true,
        sslCA: true,
        emailCA: true,
        objCA: true
    }, {
        name: 'subjectAltName',
        altNames: [{
            type: 6, // URI
            value: 'http://example.org/webid#me'
        }, {
            type: 7, // IP
            ip: '127.0.0.1'
        }]
    }, {
        name: 'subjectKeyIdentifier'
    }]);
    // self-sign certificate
    cert.sign(keys.privateKey);

    // convert a Forge certificate to PEM
    var pem = pki.certificateToPem(cert);
    const pk=pki.privateKeyToPem(keys.privateKey)

    return {privateKey: pk, certificate: pem}
}