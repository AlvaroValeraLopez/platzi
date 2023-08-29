class Deal{

  constructor(DEAL_ROW){

    const NUM_HEADERS = 19;

    if(DEAL_ROW.length !== NUM_HEADERS)
      throw new Error("The number of received parameters is different of the expected one.");
  
    let i = 0;

    this.dealId = DEAL_ROW[i++];
    this.createdAt = DEAL_ROW[i++];
    this.customerForename = DEAL_ROW[i++];
    this.customerEmail = DEAL_ROW[i++];
    this.inputEnergyAdvisorEmail = DEAL_ROW[i++];
    this.salesCallDate = DEAL_ROW[i++];
    this.salesCallTime = DEAL_ROW[i++];
    this.skipEmail = DEAL_ROW[i++];
    this.skipCalendar = DEAL_ROW[i++];
    this.skipInvoice = DEAL_ROW[i++];
    this.skipFusebox = DEAL_ROW[i++];
    this.sdr = DEAL_ROW[i++];
    this.discoveryCallFormOutput = DEAL_ROW[i++];
    this.discoveryCallSource = DEAL_ROW[i++];
    this.discoveryCallNotes = DEAL_ROW[i++];
    this.qualificationStatus = DEAL_ROW[i++];
    this.DiscoveryCallProcessClosed = DEAL_ROW[i++];
    this.energyAdvisorEmail = DEAL_ROW[i++];
    this.SalesCallTimestamp = DEAL_ROW[i];
  }

}