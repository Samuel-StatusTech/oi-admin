function Clients() {
  let uid;
  let CNPJ;
  let cashless;
  let createdAt;
  let devices;
  let expireAt;
  let name;
  let status;
  function fromJson(json) {
    this.uid = json['uid'];
    this.CNPJ = json['CNPJ'];
    this.cashless = json['cashless'];
    this.createdAt = json['createdAt'];
    this.devices = json['devices'];
    this.expireAt = json['expireAt'];
    this.name = json['name'];
    this.status = json['status'];
    return this;
  }
  return { uid, CNPJ, cashless, createdAt, devices, expireAt, name, status, fromJson };
}
export default Clients;
