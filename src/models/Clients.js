function Clients() {
  let uid = '';
  let CNPJ = '';
  let cashless;
  let createdAt;
  let devices = 0;
  let expireAt;
  let name = '';
  let status;
  let email;
  let uidUser = '';
  let logoFixed;
  let logoWebstore;
  let uf = '';
  let city = '';
  let phone = '';
  let taxes;
  let corporateName = '';
  let eCommerce;
  let hasECommerce = false; 

  function fromJson(json) {
    if (json.uid === "-NalZzvb2wasU_6duGcn") console.log("--- JSON ---\n", json)
    this.uid = json['uid'];
    this.CNPJ = json['CNPJ'];
    this.cashless = json['cashless'];
    this.createdAt = json['createdAt'];
    this.devices = json['devices'];
    this.expireAt = json['expireAt'];
    this.name = json['name'];
    this.status = json['status'];
    this.email = json['email'];
    this.uidUser = json['uidUser'];
    this.logoFixed = json['logoFixed'];
    this.logoWebstore = json['logoWebstore'];
    this.uf = json['uf'] ?? this.uf;
    this.city = json['city'] ?? this.city;
    this.phone = json['phone'] ?? this.phone;
    this.taxes = json['taxes'];
    this.eCommerce = json['eCommerce'];
    this.hasECommerce = json['hasECommerce'] ?? this.hasECommerce;
    this.corporateName = json['corporateName'] ?? '';
    return this;
  }
  function toJson() {
    return {
      uid: this.uid,
      CNPJ: this.CNPJ,
      cashless: this.cashless,
      createdAt: this.createdAt,
      devices: this.devices,
      expireAt: this.expireAt,
      name: this.name,
      status: this.status,
      email: this.email,
      uidUser: this.uidUser,
      logoFixed: this.logoFixed,
      logoWebstore: this.logoWebstore,
      uf: this.uf,
      city: this.city,
      phone: this.phone,
      taxes: this.taxes,
      eCommerce: this.eCommerce,
      hasECommerce: this.hasECommerce,
      corporateName: this.corporateName
    };
  }
  return { uid, CNPJ, cashless, createdAt, devices, expireAt, name, status, email, uidUser, uf, city, phone, taxes, eCommerce, hasECommerce, logoFixed, logoWebstore, corporateName, fromJson, toJson };
}
export default Clients;
