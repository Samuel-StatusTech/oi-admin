function Devices() {
  let imei; // Index
  let client;

  function fromJson(json) {
    this.imei = json['imei'];
    this.client = json['client'];
    return this;
  }
  function toJson() {
    return {
      imei: this.imei,
      client: this.client,
    };
  }
  return { imei, client, fromJson, toJson };
}
export default Devices;
