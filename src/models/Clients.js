function Clients() {
  let uid;
  let CNPJ;
  let cashless;
  let createdAt;
  let devices = 0;
  let expireAt;
  let name;
  let status;
  let email;
  let uidUser;
  function fromJson(json) {
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
    };
  }
  return { uid, CNPJ, cashless, createdAt, devices, expireAt, name, status, email, uidUser, fromJson, toJson };
}
export default Clients;
