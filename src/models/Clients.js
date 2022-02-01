function Clients() {
  let CNPJ;
  let cashless;
  let createdAt;
  let devices;
  let expireAt;
  let name;
  let status;
  function fromJson(json) {
    this.CNPJ = json['CNPJ'];
    this.cashless = json['cashless'];
    this.createdAt = json['createdAt'];
    this.devices = json['devices'];
    this.expireAt = json['expireAt'];
    this.name = json['name'];
    this.status = json['status'];
    return this;
  }
  return { CNPJ, cashless, createdAt, devices, expireAt, name, status, fromJson };
}
export default Clients;
