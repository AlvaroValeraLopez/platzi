function getSheet(){

    const spreadSheetId= '1xbSm2BXSMljVk6ZTJwVO5Wk1OjFQAZGm40SYpe7MBXk';
    const sheetName = 'Discovery Call';

    return SpreadsheetApp.openById(spreadSheetId).getSheetByName(sheetName);

}

function getOfferBuilderTemplateId(){
    // "1qzh3Q6SToDLntN8MSEOibQmOJ2vu3C2qoGTpGYfvrGg"; // 10.2
	// "1Fn9ByQfbOevG8JZA3K4sXQe3weiJXdvs7ahTLYKZ-Pw" // 10.3
	// "1bu2YmZU3ghCsaEbi3C1iHzyPfWWD86jFjahM8joevpo" // 10.4 Campaña wallbox y EV standalone
	// "1q_SDHiFnwM4ShEjdVHW7peQIe3Px3kC88onEuF-0yQ0" //RENTING
	return '1Pe23c7nnTrqes-Tm3QIDAEcgCldLiejyQKvSk6TftGg'; //Iva reducido
}

function getProposalSlidesTemplateId(){
	// "11uBe64NkxONq5O7mf8_v8qegDwVs5HFlaQ-SJwkvoPY"; //4.2 slide Boviet
	// "1p6P2GV9e5V9KQTpgxNZVFBnahfKCIcq8nqiPbJIw8zA"; //4.3 Tesla
	// "1ih0dJtdjUwLpQkz5qXM9BKHe31ml__vWeoaXFfZxuCI"; //4.4 Campaña wallbos y EV standalone
	return '1jQ2B0kIUHQKY6__3tvkGGKT5wTT_A2-mwY18FxkU5Nc'; //RENTING
}

function getProjectOfferBuilderId(){
    // "AKfycbwNG6rlSTvknArw2KTN3b-0geHuDkOIlnoT7K-SXgNfsvQhVI3sQrBeZNWTWhOAr6vUVg"; // BOVIET PANELS
	// "AKfycbwGR3_SjFqBsBrek668p5knPeSCTrCZLyr-ky06PNPKYWDsUXpOEtyVVT_PPL0zhGlgwA"; //tesla
	// "AKfycbyo1dmtvurb_dnpPjuwpOwLsROgMRegKLtcoSgZag_wHhfZvGkTPrGz5Znh8wNCXivTqQ"; // Wallbox y standalone
	return 'AKfycbxLd8xhZr50zDC-evluIkbjWtO9TnnTw6pK8DIxxBB8DEuVWyIdhQdB78siVb2PBp6J_A'; // RENTING

}

function processNewDiscoveryCallForm() {

	// Define Constants
    const SHEET = getSheet();

    var headersRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues();
	const lastRow = sheet.getLastRow() - 1;

	const discoveryCallProcessClosedCol = headersRow[0].indexOf('Discovery Call Process Closed') + 1;
	if (discoveryCallProcessClosedCol == 0) {
		columnNotFound('Discovery Call Process Closed', ss);
	} else {
		var discoveryCallProcessClosedArray = sheet.getRange(2, discoveryCallProcessClosedCol, lastRow, 1).getValues();
	}

	//Check if qualification process is already closed. If so, terminate execution
	/*var discoveryCallProcessClosed = discoveryCallProcessClosedArray[lastRow-1][0];
  if(discoveryCallProcessClosed == true){
    Logger.log('Kill Signal Issued');
    return 'Kill Signal Issued';
  }*/

	// WARNING: Keep updated the offer_builder_id at autoRefreshDBs() on WebApp: Offer Builder Toolbox (https://script.google.com/home/projects/1pPfVGp2AKv2svIq8w2cDLh7v1QlMh1A1BZkrsku5iD4RRBkICqFqlL5i/edit)
	const OFFER_BUILDER_VERSION = '10.7';

	const OFFER_BUILDER_TEMPLATE_ID = getOfferBuilderTemplateId();
	const PROPOSAL_SLIDES_TEMPLATE_ID = getProposalSlidesTemplateId();
	const PROJECT_OFFER_BUILDER_ID = getProjectOfferBuilderId();

	const groupEmail = 'energyadvisors@samara.energy';
	//const groupEmail = 'everyone@samara.energy';
	const eventName_sun = ' 🌞Presentación de tu estudio solar con Samara';
	const eventName = 'Presentación de tu estudio solar con Samara';
	const today = new Date();
	const timeMin = Utilities.formatDate(new Date(), 'UTC', "yyyy-MM-dd'T'HH:mm:ss.SS'Z'");
	const todayPlus90daysTime = today.getTime() + 90 * 24 * 60 * 60 * 1000;

	const todayPlus2WorkingDays = addWorkingDays(today, 2);
	const todayPlus2WorkingDaysAt9am = changeHourInDate(todayPlus2WorkingDays, 9);
	Logger.log(today);
	Logger.log(`todayPlus2WorkingDays: ${todayPlus2WorkingDays}`);
	Logger.log(`todayPlus2WorkingDaysAt9am: ${todayPlus2WorkingDaysAt9am}`);

	const timeMax = Utilities.formatDate(new Date(todayPlus90daysTime), 'UTC', "yyyy-MM-dd'T'HH:mm:ss.SS'Z'");
	const leadsChannelName = 'leads';
	const alertsSalesChannelName = 'alerts_sales';

	//Get data from Sheet

	const deal_idCol = headersRow[0].indexOf('deal_id') + 1;
	if (deal_idCol == 0) {
		Samara.columnNotFound('deal_id', ss);
		return 'Error: columnNotFound(deal_id)';
	} else {
		var deal_idArray = sheet.getRange(2, deal_idCol, lastRow, 1).getValues();
	}
	const createdAtCol = headersRow[0].indexOf('createdAt') + 1;
	if (createdAtCol == 0) {
		Samara.columnNotFound('createdAt', ss);
		return 'Error: columnNotFound(createdAt)';
	} else {
		var createdAtArray = sheet.getRange(3, createdAtCol, lastRow, 1).getValues();
	}
	const customer_forenameCol = headersRow[0].indexOf('customer_forename') + 1;
	if (customer_forenameCol == 0) {
		Samara.columnNotFound('customer_forename', ss);
		return 'Error: columnNotFound(customer_forename)';
	} else {
		var customer_forenameArray = sheet.getRange(2, customer_forenameCol, lastRow, 1).getValues();
	}
	const customer_emailCol = headersRow[0].indexOf('customer_email') + 1;
	if (customer_emailCol == 0) {
		Samara.columnNotFound('customer_email', ss);
		return 'Error: columnNotFound(customer_email)';
	} else {
		var customer_emailArray = sheet.getRange(2, customer_emailCol, lastRow, 1).getValues();
	}
	const input_energy_advisor_emailCol = headersRow[0].indexOf('input_energy_advisor_email') + 1;
	if (input_energy_advisor_emailCol == 0) {
		Samara.columnNotFound('input_energy_advisor_email', ss);
		return 'Error: columnNotFound(input_energy_advisor_email)';
	} else {
		var input_energy_advisor_emailArray = sheet.getRange(2, input_energy_advisor_emailCol, lastRow, 1).getValues();
	}
	const salesCallDateCol = headersRow[0].indexOf('salesCallDate') + 1;
	if (salesCallDateCol == 0) {
		Samara.columnNotFound('salesCallDate', ss);
		return 'Error: columnNotFound(salesCallDate)';
	} else {
		var salesCallDateArray = sheet.getRange(2, salesCallDateCol, lastRow, 1).getValues();
	}
	const salesCallTimeCol = headersRow[0].indexOf('salesCallTime') + 1;
	if (salesCallTimeCol == 0) {
		Samara.columnNotFound('salesCallTime', ss);
		return 'Error: columnNotFound(salesCallTime)';
	} else {
		var salesCallTimeArray = sheet.getRange(2, salesCallTimeCol, lastRow, 1).getValues();
	}
	const skipEmailCol = headersRow[0].indexOf('skipEmail') + 1;
	if (skipEmailCol == 0) {
		Samara.columnNotFound('skipEmail', ss);
		return 'Error: columnNotFound(skipEmail)';
	} else {
		var skipEmailArray = sheet.getRange(2, skipEmailCol, lastRow, 1).getValues();
	}
	const skipCalendarCol = headersRow[0].indexOf('skipCalendar') + 1;
	if (skipCalendarCol == 0) {
		Samara.columnNotFound('skipCalendar', ss);
		return 'Error: columnNotFound(skipCalendar)';
	} else {
		var skipCalendarArray = sheet.getRange(2, skipCalendarCol, lastRow, 1).getValues();
	}
	const skipInvoiceCol = headersRow[0].indexOf('skipInvoice') + 1;
	if (skipInvoiceCol == 0) {
		Samara.columnNotFound('skipInvoice', ss);
		return 'Error: columnNotFound(skipInvoice)';
	} else {
		var skipInvoiceArray = sheet.getRange(2, skipInvoiceCol, lastRow, 1).getValues();
	}
	const skipFuseboxCol = headersRow[0].indexOf('skipFusebox') + 1;
	if (skipFuseboxCol == 0) {
		Samara.columnNotFound('skipFusebox', ss);
		return 'Error: columnNotFound(skipFusebox)';
	} else {
		var skipFuseboxArray = sheet.getRange(2, skipFuseboxCol, lastRow, 1).getValues();
	}
	const sdrCol = headersRow[0].indexOf('sdr') + 1;
	if (sdrCol == 0) {
		Samara.columnNotFound('sdr', ss);
		return 'Error: columnNotFound(sdr)';
	} else {
		var sdrArray = sheet.getRange(2, sdrCol, lastRow, 1).getValues();
	}
	const discovery_call_notesCol = headersRow[0].indexOf('discovery_call_notes') + 1;
	if (discovery_call_notesCol == 0) {
		Samara.columnNotFound('discovery_call_notes', ss);
		return 'Error: columnNotFound(discovery_call_notes)';
	} else {
		var discovery_call_notesArray = sheet.getRange(2, discovery_call_notesCol, lastRow, 1).getValues();
	}
	const discovery_call_sourceCol = headersRow[0].indexOf('discovery_call_source') + 1;
	if (discovery_call_sourceCol == 0) {
		Samara.columnNotFound('discovery_call_source', ss);
		return 'Error: columnNotFound(discovery_call_source)';
	} else {
		var discovery_call_sourceArray = sheet.getRange(2, discovery_call_sourceCol, lastRow, 1).getValues();
	}
	const qualificationStatusCol = headersRow[0].indexOf('qualificationStatus') + 1;
	if (qualificationStatusCol == 0) {
		Samara.columnNotFound('qualificationStatus', ss);
		return 'Error: columnNotFound(qualificationStatus)';
	} else {
		var qualificationStatusArray = sheet.getRange(2, qualificationStatusCol, lastRow, 1).getValues();
	}

	const energy_advisor_emailCol = headersRow[0].indexOf('energy_advisor_email') + 1;
	if (energy_advisor_emailCol == 0) {
		Samara.columnNotFound('energy_advisor_email', ss);
		return 'Error: columnNotFound(energy_advisor_email)';
	} else {
		var energy_advisor_emailArray = sheet.getRange(2, energy_advisor_emailCol, lastRow, 1).getValues();
	}

	const salesCallTimestampCol = headersRow[0].indexOf('Sales Call Timestamp') + 1;
	if (salesCallTimestampCol == 0) {
		Samara.columnNotFound('Sales Call Timestamp', ss);
		return 'Error: columnNotFound(Sales Call Timestamp)';
	} else {
		var salesCallTimestampArray = sheet.getRange(2, salesCallTimestampCol, lastRow, 1).getValues();
	}

	const discovery_call_form_outputCol = headersRow[0].indexOf('discovery_call_form_output') + 1;
	if (discovery_call_form_outputCol == 0) {
		Samara.columnNotFound('discovery_call_form_output', ss);
		return 'Error: columnNotFound(discovery_call_form_output)';
	} else {
		var discovery_call_form_output_Array = sheet.getRange(2, discovery_call_form_outputCol, lastRow, 1).getValues();
	}

	for (var i = 0; i < qualificationStatusArray.length; i++) {
		var discoveryCallProcessClosed = discoveryCallProcessClosedArray[i][0];
		if (
			discoveryCallProcessClosed !== true &&
			discoveryCallProcessClosed !== 'ERROR' &&
			discoveryCallProcessClosed !== 'Running'
		) {
			sheet.getRange(i + 2, discoveryCallProcessClosedCol).setValue('Running');
		}
	}

	for (var i = 0; i < qualificationStatusArray.length; i++) {
		var discoveryCallProcessClosed = discoveryCallProcessClosedArray[i][0];

		if (
			discoveryCallProcessClosed !== true &&
			discoveryCallProcessClosed !== 'ERROR' &&
			discoveryCallProcessClosed !== 'Running'
		) {
			//Check if discovery call form status is Opportunity
			var qualificationStatus = qualificationStatusArray[i][0];
			var dealId = deal_idArray[i][0];
			var discoveryCallSource = discovery_call_sourceArray[i][0];

			if (qualificationStatus === 'Qualified') {
				//Get Customer details
				var customerFirstName = customer_forenameArray[i][0];
				var customerEmail = customer_emailArray[i][0];
				var skipCalendar = skipCalendarArray[i][0];
				var skipEmail = skipEmailArray[i][0];
				var skipInvoice = skipInvoiceArray[i][0];
				var skipFusebox = skipFuseboxArray[i][0];
				var sdr = sdrArray[i][0];
				var discovery_call_form_output = discovery_call_form_output_Array[i][0];
				var input_energy_advisor_email = input_energy_advisor_emailArray[i][0];

				Logger.log(
					`Qualified Opportunity - ${dealId} - ${customerFirstName} - ${customerEmail} - Skip Email: ${skipEmail} - Skip Calendar: ${skipCalendar} - Skip Invoice: ${skipInvoice} - Skip Fusebox: ${skipFusebox} - SDR: ${sdr}`,
				);

				var salesCallMeetingStatus = 'Not Evaluated';

				// Search Sales Call Meeting Among Energy Advisor's Calendars
				var salesCallEvent = Samara.searchCalendarEventsByGoogleGroup(
					groupEmail,
					timeMin,
					timeMax,
					customerEmail,
					eventName,
					eventName_sun,
				);
				if (salesCallEvent.length > 0 && salesCallEvent != 'No event found') {
					// A Calendar Event for Sales Call with customer was found
					if (salesCallEvent.length == 1) {
						// One and only one Calendar Event for Sales Call with customer was found
						// Set sales call meeting status to "Sales Call Meeting Found" and
						// Store salesCallMeeting values
						var energyAdvisorEmail = salesCallEvent[0].userEmail;
						var htmlLink = salesCallEvent[0].htmlLink;
						var hangoutLink = salesCallEvent[0].hangoutLink;
						var startDateTime = new Date(salesCallEvent[0].startDateTime);
						var salesCallStartTimestamp = startDateTime.getTime();
						salesCallMeetingStatus = 'Sales Call Meeting Found';
						var salesCallMeeting = {
							hangoutLink,
							htmlLink,
							energyAdvisorEmail,
							customerEmail,
							salesCallStartTimestamp,
						};
						var eventSummary = salesCallEvent[0].item.summary;
						salesCallStartTimestamp = new Date(salesCallStartTimestamp);

						if (eventSummary == eventName_sun || (energyAdvisorEmail == '' && skipCalendar == true)) {
							discoveryCallSource = 'Discovery Call Form - SDR';
						}

						if (skipCalendar) {
							var textMessageMeetingFoundAfterSkipCalendar = `:alert: *Sales Calls was found despite Skip Calendar given by form.* \n\n Energy Advisor:<@${Samara.getSlackUserIdByEmail(
								energyAdvisorEmail,
							)}> (${energyAdvisorEmail})\n\nSDR: ${sdr} :alert: \n\nManually check conversations with customer and delete any misleading calendar event. If needed, send the Energy Advisor Presentation Email with the link to the Sales Call meeting manually. Once solved, mark this message with a check:\n\n*Customer Name:* ${customerFirstName}\n\n<https://app-eu1.hubspot.com/contacts/25741211/deal/${dealId}|Go to HubSpot deal>`;

							var slackMessageAlertMeetingFoundAfterSkipCalendar = Samara.slackPostMessage(
								alertsSalesChannelName,
								textMessageMeetingFoundAfterSkipCalendar,
							);
							var message = JSON.parse(slackMessageAlertMeetingFoundAfterSkipCalendar.response.getContentText());
							var channelId = message.channel;
							var messageTs = message.ts.toString().replace('.', '');
							var messageLink = 'https://samarahablar.slack.com/archives/' + channelId + '/p' + messageTs;
							var textMessageMeetingFoundAfterSkipCalendar = `:alert: *New alert registered at channel <https://samarahablar.slack.com/archives/C04B1F7SLQG|#alerts_sales>*:alert: \n\n<${messageLink}|Link to alert`;
							Samara.slackPostMessage(leadsChannelName, textMessageMeetingFoundAfterSkipCalendar);
							// Mark Qualification Call row at sheet as ERROR and continue to next row
							sheet.getRange(i + 2, discoveryCallProcessClosedCol).setValue('ERROR');
							continue;
						}
					} else {
						// More than one Calendar Event for Sales Call with customer was found
						// Send Slack Alert Message: Several Sales Calls Found for the same Customer
						var energyAdvisorEmails = [];
						var slackEnergyAdvisorsToPing = '';
						for (var j = 0; j < salesCallEvent.length; j++) {
							var energyAdvisorEmail = salesCallEvent[j].userEmail;
							var htmlLink = salesCallEvent[j].htmlLink;
							var startDateTime = salesCallEvent[j].startDateTime;
							if (energyAdvisorEmails.indexOf(energyAdvisorEmail) == -1) {
								energyAdvisorEmails.push(energyAdvisorEmail);
								slackEnergyAdvisorsToPing =
									slackEnergyAdvisorsToPing +
									'\n\n' +
									(j + 1) +
									' - <@' +
									Samara.getSlackUserIdByEmail(energyAdvisorEmail) +
									'> ' +
									'<' +
									htmlLink +
									'|(Calendar Event)> at ' +
									startDateTime;
							}
						}

						var textMessageAlertDuplicatedDisoveryCall =
							':alert: *Several Sales Calls scheduled with same customer and the following EAs:* ' +
							slackEnergyAdvisorsToPing +
							' :alert: \n\nManually check conversations with customer and delete any misleading calendar event. If needed, send the Energy Advisor Presentation Email with the link to the Sales Call meeting manually. Once solved, mark this message with a check:\n\n*Customer Name:* ' +
							customerFirstName +
							'\n\n<https://app-eu1.hubspot.com/contacts/25741211/deal/' +
							dealId +
							'|Go to HubSpot deal>';

						var slackMessageAlertDuplicatedDisoveryCall = Samara.slackPostMessage(
							alertsSalesChannelName,
							textMessageAlertDuplicatedDisoveryCall,
						);
						var message = JSON.parse(slackMessageAlertDuplicatedDisoveryCall.response.getContentText());
						var channelId = message.channel;
						var messageTs = message.ts.toString().replace('.', '');
						var messageLink = 'https://samarahablar.slack.com/archives/' + channelId + '/p' + messageTs;
						var textMessageLeadsDuplicatedDisoveryCall = `:alert: *New alert registered at channel <https://samarahablar.slack.com/archives/C04B1F7SLQG|#alerts_sales>*:alert: \n\n<${messageLink}|Link to alert`;
						Samara.slackPostMessage(leadsChannelName, textMessageLeadsDuplicatedDisoveryCall);
						// Mark Qualification Call row at sheet as ERROR and continue to next row
						sheet.getRange(i + 2, discoveryCallProcessClosedCol).setValue('ERROR');
						continue;
					}
					// If Deal has an Energy Advisor owner Create Google Calendar Meeting
				} else if (salesCallEvent == 'No event found') {
					// No Calendar Event for Sales Call with customer was found
					if (input_energy_advisor_email == '' && skipCalendar == true) {
						discoveryCallSource = 'Discovery Call Form - SDR';
					}
					// If Discovery Call Form - SDR and skipCalendar = true:
					if (discoveryCallSource == 'Discovery Call Form - SDR' && skipCalendar == true) {
						// Assign an Energy Advisor
						var team_members = initializeNewLeadsAssignation();
						var most_suitable_ea = findMostSuitableSdr(team_members, 'Energy Advisors');
						var most_suitable_ea_id = most_suitable_ea.most_suitable_sdr_id;
						var energyAdvisorEmail = most_suitable_ea.most_suitable_sdr_email;
						// Set salesCallHour and salesCallDate to +2 working days from Discovery Call time
						var salesCallTime = Utilities.formatDate(
							new Date(todayPlus2WorkingDaysAt9am),
							'Europe/Madrid',
							'HH:mm',
						).toString();
						var salesCallDate = new Date(
							todayPlus2WorkingDaysAt9am.getTime() -
								todayPlus2WorkingDaysAt9am.getHours() * 60 * 60 * 1000 +
								todayPlus2WorkingDaysAt9am.getMinutes() * 60 * 1000 -
								todayPlus2WorkingDaysAt9am.getSeconds() * 1000 -
								todayPlus2WorkingDaysAt9am.getMilliseconds(),
						);
						Logger.log(`todayPlus2WorkingDaysAt9am: ${todayPlus2WorkingDaysAt9am}`);
						Logger.log(`salesCallDate: ${salesCallDate}`);
						Logger.log(`salesCallTime: ${salesCallTime}`);

						// TODO Create Send Offer Calendar Event
						var hs_link_to_deal = `https://app-eu1.hubspot.com/contacts/25741211/deal/${dealId}`;
						var { hangoutLink, htmlLink } = createSendOfferGoogleMeeting(
							todayPlus2WorkingDaysAt9am,
							energyAdvisorEmail,
							hs_link_to_deal,
						);
					} else {
						// Get hs_owner_id
						var energyAdvisor = Samara.searchHubSpotDealOwnerByDealId(dealId);
						if (input_energy_advisor_email != '') {
							var energyAdvisorEmail = input_energy_advisor_email;
						} else if (energyAdvisor.responseCode == 200) {
							var energyAdvisorEmail = energyAdvisor.responseObject.email;
						} else {
							var energyAdvisorEmail = input_energy_advisor_email;
						}
						var salesCallDate = salesCallDateArray[i][0];
						var salesCallTime = salesCallTimeArray[i][0];
					}

					if (skipCalendar == true && energyAdvisorEmail != '') {
						salesCallMeetingStatus = 'No Sales Call Meeting Booked';
						var salesCallHour = salesCallTime.toString().split(':')[0] * 60 * 60 * 1000;
						var salesCallMinutes = salesCallTime.toString().split(':')[1] * 60 * 1000;
						var salesCallStartTimestamp = new Date(salesCallDate.getTime() + salesCallHour + salesCallMinutes);
					} else if (energyAdvisorEmail != '' && salesCallTime != '' && salesCallDate != '') {
						salesCallMeetingStatus = 'Ready to Book Sales Call Meeting';
						// Else send an alert to the Energy Advisors team in Slack
					} else {
						var round_robin_confirmation_text = 'N/A';
						try {
							var discovery_call_form_output = discovery_call_form_output_Array[i][0];
							var discovery_call_form_output_json = JSON.parse(discovery_call_form_output);
							round_robin_confirmation_text = discovery_call_form_output_json.body.round_robin_confirmation_text;
						} catch (e) {}
						var textMessageAlertNotScheduledSalesCall =
							':alert: *No Sales Calls scheduled with customer after Discovery Call Form received* :alert:  \n\n There is No Sales Call Meeting Booked and there is no enough info to do it. Manually solve the issue and then mark this message with a check:\n\n*Customer Name:* ' +
							customerFirstName +
							'\n\n*SDR*:' +
							sdr +
							'\n\n*Round Robin Confirmation Text:*' +
							round_robin_confirmation_text +
							'\n\n<https://app-eu1.hubspot.com/contacts/25741211/deal/' +
							dealId +
							'|Go to HubSpot deal>';

						var slackMessageAlertNotScheduledSalesCall = Samara.slackPostMessage(
							alertsSalesChannelName,
							textMessageAlertNotScheduledSalesCall,
						);
						var message = JSON.parse(slackMessageAlertNotScheduledSalesCall.response.getContentText());
						var channelId = message.channel;
						var messageTs = message.ts.toString().replace('.', '');
						var messageLink = 'https://samarahablar.slack.com/archives/' + channelId + '/p' + messageTs;
						var textMessageLeadsNotScheduledSalesCall =
							':alert: *New alert registered at channel <https://samarahablar.slack.com/archives/C04B1F7SLQG|#alerts_sales>*:alert: \n\n<' +
							messageLink +
							'|Link to alert';
						Samara.slackPostMessage(leadsChannelName, textMessageLeadsNotScheduledSalesCall);
						// Mark Qualification Call row at sheet as ERROR
						sheet.getRange(i + 2, discoveryCallProcessClosedCol).setValue('ERROR');
						continue;
					}
				} else {
					// An error occured while searching Calendar Event for Sales Call with customer
					var textMessageAlertNotScheduledSalesCall =
						':alert: *No Sales Calls scheduled with customer after Discovery Call Form received* :alert:  \n\n ERROR: at var salesCallEvent = searchCalendarEventsByGoogleGroup(groupEmail,timeMin, customerEmail, eventName). Manually solve the issue and then mark this message with a check:\n\n*Customer Name:* ' +
						customerFirstName +
						'\n\n<https://app-eu1.hubspot.com/contacts/25741211/deal/' +
						dealId +
						'|Go to HubSpot deal>';

					var slackMessageAlertNotScheduledSalesCall = Samara.slackPostMessage(
						alertsSalesChannelName,
						textMessageAlertNotScheduledSalesCall,
					);
					var message = JSON.parse(slackMessageAlertNotScheduledSalesCall.response.getContentText());
					var channelId = message.channel;
					var messageTs = message.ts.toString().replace('.', '');
					var messageLink = 'https://samarahablar.slack.com/archives/' + channelId + '/p' + messageTs;
					var textMessageLeadsNotScheduledSalesCall = `:alert: *New alert registered at channel <https://samarahablar.slack.com/archives/C04B1F7SLQG|#alerts_sales>*:alert: \n\n<${messageLink}|Link to alert`;
					Samara.slackPostMessage(leadsChannelName, textMessageLeadsNotScheduledSalesCall);
					Logger.log(
						'ERROR: at var salesCallEvent = searchCalendarEventsByGoogleGroup(groupEmail,timeMin, customerEmail, eventName);',
					);
					// Mark Qualification Call row at sheet as ERROR
					sheet.getRange(i + 2, discoveryCallProcessClosedCol).setValue('ERROR');
					continue;
				}

				//Get Energy Advisor data from HubSpot
				var searchHubSpotEnergyAdvisorContactByEmailResponse =
					Samara.searchHubSpotEnergyAdvisorContactByEmail(energyAdvisorEmail);
				if (searchHubSpotEnergyAdvisorContactByEmailResponse.responseCode == 200) {
					try {
						var valid_energy_advisor = true;
						var energy_advisor_details = JSON.parse(
							searchHubSpotEnergyAdvisorContactByEmailResponse.responseObject.results[0].properties
								.energy_advisor_details,
						);
						var energy_advisor_html_presentation = energy_advisor_details.html_presentation;
					} catch (e) {
						var valid_energy_advisor = false;
						Logger.log(e);
					}
					if (energy_advisor_details !== null && energy_advisor_html_presentation !== 'null' && valid_energy_advisor) {
						var energy_advisor_html_presentation = energy_advisor_details.html_presentation;
						var energyAdvisorDisplayName = energy_advisor_details.firstName + ' de Samara';
						var hubspotOwnerId = energy_advisor_details.hubspot_owner.id;
						var slackUserId = energy_advisor_details.slackUserId;
						var energyAdvisorFirstName = energy_advisor_details.firstName;
					} else {
						var textMessageAlertEnergyAdvisorDetailsNotFound = `:alert: *Sales Call Booking Process Interrupted: Energy Advisor Details not found for <@${Samara.getSlackUserIdByEmail(
							energyAdvisorEmail,
						)}> (${energyAdvisorEmail})* :alert: \n\n Add new Energy Advisor profile at <https://docs.google.com/spreadsheets/d/194j2uN3kdsmCkzr_AuZmwcXLtfBij97LUi4Y8G7DNM8/edit#gid=0|Energy Advisors - Database> to solve the issue and then mark this message with a check. Once done, interrupted Sales Call process will continue automatically :\n\n*Customer Name:* ${customerFirstName} \n\n<https://app-eu1.hubspot.com/contacts/25741211/deal/${dealId}|Go to HubSpot deal>`;

						var slackMessageAlertEnergyAdvisorDetailsNotFound = Samara.slackPostMessage(
							alertsSalesChannelName,
							textMessageAlertEnergyAdvisorDetailsNotFound,
						);
						var message = JSON.parse(slackMessageAlertEnergyAdvisorDetailsNotFound.response.getContentText());
						var channelId = message.channel;
						var messageTs = message.ts.toString().replace('.', '');
						var messageLink = 'https://samarahablar.slack.com/archives/' + channelId + '/p' + messageTs;
						var textMessageLeadsEnergyAdvisorDetailsNotFound = `:alert: *New alert registered at channel <https://samarahablar.slack.com/archives/C04B1F7SLQG|#alerts_sales>*:alert: \n\n<${messageLink}|Link to alert`;
						Samara.slackPostMessage(leadsChannelName, textMessageLeadsEnergyAdvisorDetailsNotFound);
						Logger.log(textMessageAlertEnergyAdvisorDetailsNotFound);
						// Mark Qualification Call row at sheet as ERROR
						sheet.getRange(i + 2, discoveryCallProcessClosedCol).setValue('ERROR');
						continue;
					}
				} else {
					var textMessageAlertEnergyAdvisorDetailsNotFound = `:alert: *Sales Call Booking Process Interrupted: Energy Advisor Details not found for <@${Samara.getSlackUserIdByEmail(
						energyAdvisorEmail,
					)}> (${energyAdvisorEmail})* :alert: \n\n Error at  Samara.searchHubSpotEnergyAdvisorContactByEmail(energyAdvisorEmail); Response Code is not 200:\n\n Respons Code: ${
						searchHubSpotEnergyAdvisorContactByEmailResponse.responseCode
					} ${searchHubSpotEnergyAdvisorContactByEmailResponse.responseObject.getContentText()}\n\n*Customer Name:* ${customerFirstName} \n\n<https://app-eu1.hubspot.com/contacts/25741211/deal/${dealId}|Go to HubSpot deal>`;
					var slackMessageAlertEnergyAdvisorDetailsNotFound = Samara.slackPostMessage(
						alertsSalesChannelName,
						textMessageAlertEnergyAdvisorDetailsNotFound,
					);
					var message = JSON.parse(slackMessageAlertEnergyAdvisorDetailsNotFound.response.getContentText());
					var channelId = message.channel;
					var messageTs = message.ts.toString().replace('.', '');
					var messageLink = 'https://samarahablar.slack.com/archives/' + channelId + '/p' + messageTs;
					var textMessageLeadsEnergyAdvisorDetailsNotFound = `:alert: *New alert registered at channel <https://samarahablar.slack.com/archives/C04B1F7SLQG|#alerts_sales>*:alert: \n\n<${messageLink}|Link to alert`;
					Samara.slackPostMessage(leadsChannelName, textMessageLeadsEnergyAdvisorDetailsNotFound);
					Logger.log(textMessageAlertEnergyAdvisorDetailsNotFound);
					// Mark Qualification Call row at sheet as ERROR
					sheet.getRange(i + 2, discoveryCallProcessClosedCol).setValue('ERROR');
					continue;
				}

				if (salesCallMeetingStatus == 'Ready to Book Sales Call Meeting') {
					var salesCallHour = salesCallTime.toString().split(':')[0] * 60 * 60 * 1000;
					var salesCallMinutes = salesCallTime.toString().split(':')[1] * 60 * 1000;
					var salesCallStartTimestamp = new Date(salesCallDate.getTime() + salesCallHour + salesCallMinutes);
					//Check if time is in the future
					var salesCallStartTimestampValueOf = salesCallStartTimestamp.valueOf() * 1;
					if (isNaN(salesCallStartTimestampValueOf) || salesCallStartTimestamp.valueOf() < today.valueOf()) {
						var textMessageAlertSalesCallDateIsPast = `:alert: *Sales Call Booking Process Interrupted: Sales Call Date ${salesCallStartTimestamp} is in the past or wrong for <@${Samara.getSlackUserIdByEmail(
							energyAdvisorEmail,
						)}> (${energyAdvisorEmail})* :alert: \n\n Check the sales call date at Discovery Call form to solve the issue and then mark this message with a check. Once done, interrupted Sales Call process will continue automatically :\n\n*Customer Name:* ${customerFirstName} \n\n<https://app-eu1.hubspot.com/contacts/25741211/deal/${dealId}|Go to HubSpot deal>`;

						var slackMessageAlertSalesCallDateIsPast = Samara.slackPostMessage(
							alertsSalesChannelName,
							textMessageAlertSalesCallDateIsPast,
						);
						var message = JSON.parse(slackMessageAlertSalesCallDateIsPast.response.getContentText());
						var channelId = message.channel;
						var messageTs = message.ts.toString().replace('.', '');
						var messageLink = 'https://samarahablar.slack.com/archives/' + channelId + '/p' + messageTs;
						var textMessageLeadsAlert = `:alert: *New alert registered at channel <https://samarahablar.slack.com/archives/C04B1F7SLQG|#alerts_sales>*:alert: \n\n<${messageLink}|Link to alert`;
						Samara.slackPostMessage(leadsChannelName, textMessageLeadsAlert);
						Logger.log(textMessageLeadsAlert);
						// Mark Discovery Call row at sheet as ERROR
						sheet.getRange(i + 2, discoveryCallProcessClosedCol).setValue('ERROR');
						continue;
					}
					//Create Sales Call Calendar Event
					var { hangoutLink, htmlLink } = createSalesCallGoogleMeeting(
						salesCallStartTimestamp,
						energyAdvisorDisplayName,
						energyAdvisorEmail,
						customerEmail,
					);
					var salesCallMeeting = {
						hangoutLink,
						htmlLink,
						energyAdvisorEmail,
						customerEmail,
						salesCallStartTimestamp,
					};
				}

				Logger.log(`salesCallMeetingStatus: ${salesCallMeetingStatus}`);
				Logger.log(salesCallMeeting);

				// Create Project Drive Folder from template with a copy of Offer Builder Sheet template and Presentation Slides Template
				var deal_params = `associations=contacts&properties=dealname`;
				try {
					var deal = Samara.getHubSpotDeal(dealId, deal_params);
					var dealname = deal.responseObject.properties.dealname;
					if (deal.responseObject.associations.contacts.results.length == 1) {
						var contact_id = deal.responseObject.associations.contacts.results[0].id;
					} else {
						var contact_id = 'Non valid unique contact id';
					}
					//var dealname = Samara.searchHubSpotDeal(searchDealData).responseObject.results[0].properties.dealname;
					var deal_folder_structure = Samara.createDealFolder(dealname);
					var projectFolderUrl = DriveApp.getFolderById(deal_folder_structure.deal_folder_id).getUrl();

					var offer_builder_id = Samara.copy_files(
						OFFER_BUILDER_TEMPLATE_ID,
						`Offer Builder ${OFFER_BUILDER_VERSION} - ${dealname}`,
						deal_folder_structure.samara_proposal.editables_folder_id,
					);
					var proposal_slides_id = Samara.copy_files(
						PROPOSAL_SLIDES_TEMPLATE_ID,
						'Template Oferta Solar 2.0 - Propuesta Samara - ' + dealname,
						deal_folder_structure.samara_proposal.editables_folder_id,
					);

					var rich_text_project_folder = `<p><a href=\"${projectFolderUrl}\" rel=\"ugc noopener\" target=\"_blank\">${dealname}</a></p>`;
					var linkToOfferBuilderWebApp = `https://script.google.com/a/macros/samara.energy/s/${PROJECT_OFFER_BUILDER_ID}/exec?offer_builder_id=${offer_builder_id}&deal_name=${dealname}&deal_id=${dealId}&OFFER_BUILDER_VERSION=${OFFER_BUILDER_VERSION}`;
					var hyperlinkToOfferBuilderWebApp = SpreadsheetApp.newRichTextValue()
						.setText('Click here to open Offer Builder WebApp')
						.setLinkUrl(linkToOfferBuilderWebApp)
						.build();

					var rich_text_offer_builder_webapp = `<p><a href=\"${linkToOfferBuilderWebApp}\" rel=\"ugc noopener\" target=\"_blank\">Offer Builder WebApp Tool</a></p>`;

					// Fill Offer Builder Sheet with Deal Id and Proposal Slides URL
					try {
						var offer_builder = SpreadsheetApp.openById(offer_builder_id);
						var offer_builder_input_data_sheet = offer_builder.getSheetByName('Input Data 2.0 (WIP)');
						offer_builder.addDeveloperMetadata('deal_folder_id', deal_folder_structure.deal_folder_id);
						offer_builder.addDeveloperMetadata(
							'customer_information_folder_id',
							deal_folder_structure.customer_information.folder_id,
						);
						offer_builder.addDeveloperMetadata(
							'electrical_bill_folder_id',
							deal_folder_structure.customer_information.electrical_bill_folder_id,
						);
						offer_builder.addDeveloperMetadata(
							'customer_docs_folder_id',
							deal_folder_structure.customer_information.customer_docs_folder_id,
						);
						offer_builder.addDeveloperMetadata(
							'samara_proposal_folder_id',
							deal_folder_structure.samara_proposal.folder_id,
						);
						offer_builder.addDeveloperMetadata(
							'editables_folder_id',
							deal_folder_structure.samara_proposal.editables_folder_id,
						);
						offer_builder.addDeveloperMetadata(
							'final_proposal_folder_id',
							deal_folder_structure.samara_proposal.final_proposal_folder_id,
						);
						offer_builder.addDeveloperMetadata(
							'contract_payments_folder_id',
							deal_folder_structure.contract_payments.folder_id,
						);
						offer_builder.addDeveloperMetadata(
							'signed_contract_folder_id',
							deal_folder_structure.contract_payments.signed_contract_folder_id,
						);
						offer_builder.addDeveloperMetadata(
							'financial_folder_id',
							deal_folder_structure.contract_payments.financial_folder_id,
						);
						offer_builder.addDeveloperMetadata(
							'bills_folder_id',
							deal_folder_structure.contract_payments.bills_folder_id,
						);
						offer_builder.addDeveloperMetadata('procurement_folder_id', deal_folder_structure.procurement.folder_id);
						offer_builder.addDeveloperMetadata(
							'permitting_legal_folder_id',
							deal_folder_structure.permitting_legal.folder_id,
						);
						offer_builder.addDeveloperMetadata(
							'technical_memo_folder_id',
							deal_folder_structure.permitting_legal.technical_memo_folder_id,
						);
						offer_builder.addDeveloperMetadata(
							'permitting_docs_folder_id',
							deal_folder_structure.permitting_legal.permitting_docs_folder_id,
						);
						offer_builder.addDeveloperMetadata(
							'legalization_folder_id',
							deal_folder_structure.permitting_legal.legalization_folder_id,
						);
						offer_builder.addDeveloperMetadata(
							'subsidies_taxes_folder_id',
							deal_folder_structure.subsidies_taxes.folder_id,
						);
						offer_builder.addDeveloperMetadata(
							'subsidies_folder_id',
							deal_folder_structure.subsidies_taxes.subsidies_folder_id,
						);
						offer_builder.addDeveloperMetadata(
							'taxes_folder_id',
							deal_folder_structure.subsidies_taxes.taxes_folder_id,
						);
						offer_builder.addDeveloperMetadata(
							'thidpartner_payments_folder_id',
							deal_folder_structure.subsidies_taxes.thidpartner_payments_folder_id,
						);
						offer_builder.addDeveloperMetadata('OFFER_BUILDER_VERSION', OFFER_BUILDER_VERSION);
						offer_builder_input_data_sheet.getRange('C2').setValue(dealId);
						offer_builder_input_data_sheet.getRange('C3').setValue(proposal_slides_id);
						offer_builder_input_data_sheet.getRange('B6').setRichTextValue(hyperlinkToOfferBuilderWebApp);
					} catch (e) {
						Logger.log('Error at Fill Offer Builder Sheet with Deal Id and Proposal Slides URL');
						var textMessageAlertFillOfferBuilderSheet = `:alert: *Discovery Call Proccessed with an error* :alert: \n\n Error at Fill Offer Builder Sheet with Deal Id and Proposal Slides URL:\n\n*Customer Name:* ${customerFirstName} \n\n<https://app-eu1.hubspot.com/contacts/25741211/deal/${dealId}|Go to HubSpot deal>`;
						var slackMessageAlertFillOfferBuilderSheet = Samara.slackPostMessage(
							alertsSalesChannelName,
							textMessageAlertFillOfferBuilderSheet,
						);
						var message = JSON.parse(slackMessageAlertFillOfferBuilderSheet.response.getContentText());
						var channelId = message.channel;
						var messageTs = message.ts.toString().replace('.', '');
						var messageLink = 'https://samarahablar.slack.com/archives/' + channelId + '/p' + messageTs;
						var textMessageLeadsFillOfferBuilderSheet = `:alert: *New alert registered at channel <https://samarahablar.slack.com/archives/C04B1F7SLQG|#alerts_sales>*:alert: \n\n<${messageLink}|Link to alert`;
						Samara.slackPostMessage(leadsChannelName, textMessageLeadsFillOfferBuilderSheet);
					}
				} catch (e) {
					var dealname = dealId + ' - ';
					var projectFolderUrl = null;
					var rich_text_project_folder = '';
					var offer_builder_id = '';
					var proposal_slides_id = '';
					var linkToOfferBuilderWebApp = '';
					Logger.log(
						`Error at Create Project Drive Folder from template with a copy of Offer Builder Sheet template and Presentation Slides Template;`,
					);
					var textMessageAlertCreatePorjectDriveFolder = `:alert: *Discovery Call Proccessed with an error* :alert: \n\n Error at Create Project Drive Folder from template with a copy of Offer Builder Sheet template and Presentation Slides Template:\n\n*Customer Name:* ${customerFirstName} \n\n<https://app-eu1.hubspot.com/contacts/25741211/deal/${dealId}|Go to HubSpot deal> \n\n ERROR: ${e}`;
					var slackMessageAlertCreatePorjectDriveFolder = Samara.slackPostMessage(
						alertsSalesChannelName,
						textMessageAlertCreatePorjectDriveFolder,
					);
					var message = JSON.parse(slackMessageAlertCreatePorjectDriveFolder.response.getContentText());
					var channelId = message.channel;
					var messageTs = message.ts.toString().replace('.', '');
					var messageLink = 'https://samarahablar.slack.com/archives/' + channelId + '/p' + messageTs;
					var textMessageLeadsCreatePorjectDriveFolder = `:alert: *New alert registered at channel <https://samarahablar.slack.com/archives/C04B1F7SLQG|#alerts_sales>*:alert: \n\n<${messageLink}|Link to alert`;
					Samara.slackPostMessage(leadsChannelName, textMessageLeadsCreatePorjectDriveFolder);
				}

				var discoveryCallNotes = discovery_call_notesArray[i][0];
				var salesCallStartDate = new Date(salesCallStartTimestamp);
				var salesCallStartDateTime = salesCallStartDate.getTime() - 24 * 60 * 60 * 1000;
				if (skipCalendar != true) {
					// HubSpot Task: Create Offer
					var hs_create_offer_task_start_time = Utilities.formatDate(
						new Date(salesCallStartDateTime),
						'GTM+2',
						"yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
					); // Due 24h before the Sales Call Start time
					Logger.log(`hs_create_offer_task_start_time: ${hs_create_offer_task_start_time}`);
					var hs_create_offer_task_subject = 'Create Offer';
					var hs_create_offer_task_body = '<br>Link to Project Drive Folder: ' + projectFolderUrl + '<br/>'; // Add link to Project Folder with offer template and offer builder template
					var hs_create_offer_task_status = 'NOT_STARTED';
					var hs_create_offer_task_priority = 'HIGH';
					var hs_createOfferTask = Samara.createHubspotTask(
						hs_create_offer_task_start_time,
						hubspotOwnerId,
						hs_create_offer_task_subject,
						hs_create_offer_task_body,
						hs_create_offer_task_status,
						hs_create_offer_task_priority,
					);
					Logger.log(hs_createOfferTask);

					// Associate Create Offer Task to Deal
					var taskToDealAssociation = Samara.associateTaskToDeal(hs_createOfferTask.id, dealId);
					Logger.log(taskToDealAssociation);

					// HubSpot Task:Sales Call or Send Offer
					var discoveryCallNotes = discovery_call_notesArray[i][0];
					var hs_task_subject = 'Sales Call';
					var hs_task_body =
						'<br>Sales Call Calendar Link: ' +
						htmlLink +
						'<br/><br>Notes from Discovery Call: ' +
						discoveryCallNotes +
						'<br/>'; // Add link to Meeting and Project Drive Folder

					var hs_meeting_start_time = Utilities.formatDate(
						new Date(salesCallStartTimestamp),
						'GTM+2',
						"yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
					);
					Logger.log(`hs_meeting_start_time: ${hs_meeting_start_time}`);
					var hs_task_status = 'NOT_STARTED';
					var hs_task_priority = 'HIGH';
					var hs_salesCallTask = Samara.createHubspotTask(
						hs_meeting_start_time,
						hubspotOwnerId,
						hs_task_subject,
						hs_task_body,
						hs_task_status,
						hs_task_priority,
					);
					Logger.log(hs_salesCallTask);

					// Associate Sales Call Task to Deal
					var taskToDealAssociation = Samara.associateTaskToDeal(hs_salesCallTask.id, dealId);
					Logger.log(taskToDealAssociation);

					// HubSpot Task: Sales Call Reminder Task if there are more than 39h left to the event
					var nowDate = new Date();
					var nowTime = nowDate.getTime();
					var milisecondsIn39hours = 39 * 60 * 60 * 1000;
					var milisecondsIn24hours = 24 * 60 * 60 * 1000;
					// Check if there are more than 39h left to the event
					var salesCallReminderTaskNeeded = salesCallStartDate.getTime() - nowTime > milisecondsIn39hours;
					if (salesCallReminderTaskNeeded) {
						var salesCallStartDateTime24h = salesCallStartDate.getTime() - 24 * 60 * 60 * 1000;
						//Set the reminder task time to be 24h before the discovery call BUT if the reminder task time is then less than 24h from the submission date of the Qualification form, then set the reminder task time 24h after the Qualification form submission.
						if (salesCallStartDateTime24h - nowTime > milisecondsIn24hours) {
							var hs_sales_call_reminder_task_start_time = Utilities.formatDate(
								new Date(salesCallStartDateTime24h),
								'GTM+2',
								"yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
							); // Due 24h before the Sales Call Start time
						} else {
							var discoveryCallCreatedAtPlus24h = nowTime + 24 * 60 * 60 * 1000;
							var hs_sales_call_reminder_task_start_time = Utilities.formatDate(
								new Date(discoveryCallCreatedAtPlus24h),
								'GTM+2',
								"yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
							); // Due 24h after the Discovery Call was created
						}
						Logger.log(`hs_sales_call_reminder_task_start_time: ${hs_sales_call_reminder_task_start_time}`);
						const hs_task_sales_call_reminder_subject = 'Contact lead to remind them about Sales call';
						const hs_task_sales_call_reminder_body =
							'Use template Qualified lead - Recordatorio de sales call (if you send the reminder via email) or the Whatsapp template located in https://www.notion.so/Customer-comms-pre-sale-52d921cc78d6458fa7e271b1305a2183#1fc144a8b85f451a87b97ba072ff5885 under the section 2.2 Qualified lead: Sales call reminder';
						const hs_task_sales_call_reminder_status = 'NOT_STARTED';
						const hs_task_sales_call_reminder_priority = 'LOW';

						var hs_salesCallReminderTask = Samara.createHubspotTask(
							hs_sales_call_reminder_task_start_time,
							hubspotOwnerId,
							hs_task_sales_call_reminder_subject,
							hs_task_sales_call_reminder_body,
							hs_task_sales_call_reminder_status,
							hs_task_sales_call_reminder_priority,
						);
						Logger.log(hs_salesCallReminderTask);

						// Associate Sales Call Reminder Task to Deal
						var taskToDealAssociation = Samara.associateTaskToDeal(hs_salesCallReminderTask.id, dealId);
						Logger.log(taskToDealAssociation);
					}
				} else {
					// skipCalendar = false
					// HubSpot Task: Create and send offer without sales call
					var discoveryCallNotes = discovery_call_notesArray[i][0];
					var hs_task_subject = 'Create and send offer without sales call';
					var hs_task_body =
						'<br>Send Offer via email without sales call<br/><br>Notes from Discovery Call: ' +
						discoveryCallNotes +
						'<br/><br>Link to Project Drive Folder: ' +
						projectFolderUrl +
						'<br/>'; // Add link to Meeting and Project Drive Folder
					var hs_meeting_start_time = Utilities.formatDate(
						new Date(salesCallStartTimestamp),
						'GTM+2',
						"yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
					);
					Logger.log(`salesCallStartTimestamp: ${salesCallStartTimestamp}`);
					Logger.log(`hs_meeting_start_time: ${hs_meeting_start_time}`);
					var hs_task_status = 'NOT_STARTED';
					var hs_task_priority = 'HIGH';
					var hs_salesCallTask = Samara.createHubspotTask(
						hs_meeting_start_time,
						hubspotOwnerId,
						hs_task_subject,
						hs_task_body,
						hs_task_status,
						hs_task_priority,
					);
					Logger.log(hs_salesCallTask);

					// Associate Sales Call Task to Deal
					var taskToDealAssociation = Samara.associateTaskToDeal(hs_salesCallTask.id, dealId);
					Logger.log(taskToDealAssociation);
				}

				// Patch HubSpot Deal to set Energy Advisor as deal Owner and store Sales Call Task Id
				var dealData = {
					properties: {
						hubspot_owner_id: hubspotOwnerId,
						sales_call_task_id: hs_salesCallTask.id,
						project_folder_url: projectFolderUrl,
						project_folder: rich_text_project_folder,
						OFFER_BUILDER_TEMPLATE_ID: offer_builder_id,
						energy_advisor: hubspotOwnerId,
					},
				};
				var patchedDeal = Samara.patchHubSpotDeal(dealId, dealData);

				// Patch HubSpot Contact to set Energy Advisor as Contact Owner
				if (contact_id != 'Non valid unique contact id') {
					var contact_data = {
						properties: {
							hubspot_owner_id: hubspotOwnerId,
							energy_advisor: hubspotOwnerId,
						},
					};
					var patchContact = Samara.patchHubSpotContact(contact_id, contact_data);
					if (patchContact.responseCode != 200) {
						Logger.log('ERROR: Samara.patchHubSpotContact(contact_id,contact_data)');
					} else {
						Logger.log('Success: patchHubSpotContact(contact_id,contact_data)');
					}
				}

				// If Discovery Call Source is a Growth Partner
				if (
					discoveryCallSource == 'Selectra' ||
					discoveryCallSource == 'selectra' ||
					discoveryCallSource == 'soof' ||
					discoveryCallSource == 'performanze' ||
					discoveryCallSource == 'aticpower' ||
					discoveryCallSource == 'Discovery Call Form - SDR'
				) {
					// Send Growth Partner: Energy Advisor Presentation + Sales Call Link Email with Sales Call Invite via SendGrid and Slack notification to the team

					if (skipCalendar == true) {
						// Send Growth Partner Sales Call Slack notification to #leads
						var textMessage =
							'*New discovered lead from ' +
							discoveryCallSource +
							'! Lead assigned to <@' +
							Samara.getSlackUserIdByEmail(energyAdvisorEmail) +
							'> * \n\n Task to create and send offer without sales call added to HubSpot \n\n*Customer Name:* ' +
							customerFirstName +
							'\n\n<https://app-eu1.hubspot.com/contacts/25741211/deal/' +
							dealId +
							'|Go to HubSpot deal>';
					} else {
						// Send Growth Partner Sales Call Slack notification to #leads
						var textMessage =
							'*New discovered lead from ' +
							discoveryCallSource +
							'! Sales Call scheduled with <@' +
							Samara.getSlackUserIdByEmail(energyAdvisorEmail) +
							'> * \n\nCalendar event created and Energy Advisor Presentation + Sales Call email sent. Please check in HubSpot that the email was sent:\n\n*Customer Name:* ' +
							customerFirstName +
							'\n\n<https://app-eu1.hubspot.com/contacts/25741211/deal/' +
							dealId +
							'|Go to HubSpot deal>';
						salesCallStartTimestamp = new Date(salesCallStartTimestamp);
						Logger.log(`salesCallStartTimestamp: ${salesCallStartTimestamp}`);
						var growthPartnerEnergyAdvisorPresentationEmail = sendGrowthPartnerEnergyAdvisorPresentationSalesCallEmail(
							energyAdvisorEmail,
							energyAdvisorFirstName,
							customerEmail,
							customerFirstName,
							salesCallStartTimestamp,
							hangoutLink,
							energy_advisor_html_presentation,
						);
						Logger.log(growthPartnerEnergyAdvisorPresentationEmail);
					}

					// If Discovery Call Source is Discovery Call Form (Former Qualification + Discovery Call Form)
				} else if (discoveryCallSource == 'Discovery Call Form') {
					// Send Energy Advisor Presentation + Sales Call Link Email with Sales Call Invite via SendGrid

					if (skipCalendar == false && skipEmail == false) {
						var energyAdvisorSalesCallEmail = sendEnergyAdvisorSalesCallEmail(
							energyAdvisorEmail,
							energyAdvisorFirstName,
							customerEmail,
							customerFirstName,
							salesCallStartTimestamp,
							hangoutLink,
							energy_advisor_html_presentation,
						);
						Logger.log(energyAdvisorSalesCallEmail);
						// Send Energy Advisor Sales Call Slack notification to #leads
						var textMessage =
							'*Another Successful Qualification + Discovery Call done! Sales Call scheduled with <@' +
							Samara.getSlackUserIdByEmail(energyAdvisorEmail) +
							'> * \n\nCalendar event created and Sales Call Appointment email sent. Please check in HubSpot that the email was sent:\n\n*Customer Name:* ' +
							customerFirstName +
							'\n\n<https://app-eu1.hubspot.com/contacts/25741211/deal/' +
							dealId +
							'|Go to HubSpot deal>';
					} else {
						if (salesCallMeetingStatus == 'No Sales Call Meeting Booked') {
							// Send Energy Advisor Sales Call Slack notification to #leads
							var textMessage =
								'*Another Successful Qualification + Discovery Call done! Sales Call assigned to <@' +
								Samara.getSlackUserIdByEmail(energyAdvisorEmail) +
								'> * \n\n:warning::x: No calendar event created:x::warning: \n\n :x::warning:No Sales Call Appointment email sent :x::warning: \n\nPlease check the Deal in HubSpot, add a manual note and send an email if needed:\n\n*Customer Name:* ' +
								customerFirstName +
								'\n\n<https://app-eu1.hubspot.com/contacts/25741211/deal/' +
								dealId +
								'|Go to HubSpot deal>';
						} else {
							// Send Energy Advisor Sales Call Slack notification to #leads
							var textMessage =
								'*Another Successful Qualification + Discovery Call done! Sales Call assigned to <@' +
								Samara.getSlackUserIdByEmail(energyAdvisorEmail) +
								'> * \n\n:warning::white_check_mark: Calendar event created:white_check_mark::warning: \n\n :x::warning:No Sales Call Appointment email sent :x::warning: \n\nPlease check the Deal in HubSpot, add a manual note and send an email if needed:\n\n*Customer Name:* ' +
								customerFirstName +
								'\n\n<https://app-eu1.hubspot.com/contacts/25741211/deal/' +
								dealId +
								'|Go to HubSpot deal>';
						}
					}
				} else {
					// Send Unknown Source Sales Call Slack notification to #leads
					var textMessage =
						'*New discovered lead from and unknown source "' +
						discoveryCallSource +
						'"! Sales Call scheduled with <@' +
						Samara.getSlackUserIdByEmail(energyAdvisorEmail) +
						'> * \n\n:warning::white_check_mark:Calendar event created:white_check_mark::warning: \n\n :warning: No Sales Call email sent. Check the case in HubSpot and send the email manually :warning:\n\n*Customer Name:* ' +
						customerFirstName +
						'\n\n<https://app-eu1.hubspot.com/contacts/25741211/deal/' +
						dealId +
						'|Go to HubSpot deal>';
				}
				Samara.slackPostMessage(leadsChannelName, textMessage);

				// Send WhatsApp
				Logger.log('WhatsApp');
				// Check WhatsApp consent at Discovery Call response

				try {
					var discovery_call_form_output = discovery_call_form_output_Array[i][0];
					var discovery_call_form_output_json = JSON.parse(discovery_call_form_output);
					var whatsapp_contact_method = discovery_call_form_output_json.body.whatsapp_contact_method;
				} catch (e) {
					var whatsapp_contact_method = 'Not found';
				}

				try {
					var discovery_call_form_output = discovery_call_form_output_Array[i][0];
					var discovery_call_form_output_json = JSON.parse(discovery_call_form_output);
					var skipFirstWhatsApp = discovery_call_form_output_json.body.skipFirstWhatsApp;
				} catch (e) {
					var skipFirstWhatsApp = 'Not found';
				}
				// Check EA is within the WhatsApp test group
				var whatsapp_test_group = [
					'jaime.bonilla@samara.energy',
					'jon.perez@samara.energy',
					'pablo.sanchez@samara.energy',
					'francisco.galan@samara.energy',
					'eder.moreno@samara.energy',
					'bernardo.sanz@samara.energy',
					'paula.saiz@samara.energy',
					'gonzalo.echarri@samara.energy',
					'alejandro@samara.energy',
				];
				var whatsapp_test_group_check = whatsapp_test_group.indexOf(energyAdvisorEmail) != -1;
				whatsapp_test_group_check = true;
				// TODO: Check if Phone Number is a valid mobile phone for WhatsApp
				var whatsapp_phone_number = '';
				// If conditions are met:
				Logger.log(
					`WhatsApp Conditions: whatsapp_test_group_check = ${whatsapp_test_group_check} && whatsapp_contact_method =${whatsapp_contact_method}`,
				);
				if (whatsapp_test_group_check == true && whatsapp_contact_method == 'true') {
					// Set the First WhatsApp Conversation Path
					var first_whatsapp_conversation_path = '1st_contact_with_ea_after_qd';
					// Get WhatsApp variables
					var ready_to_initiate_whatsapp_conversation = 'true';

					var sales_call_month = monthInSpanish(salesCallStartTimestamp.getMonth());
					var sales_call_day = salesCallStartTimestamp.getDate();
					var sales_call_time = Utilities.formatDate(new Date(salesCallStartTimestamp), 'Europe/Madrid', 'HH:mm');
					Logger.log(`salesCallStartTimestamp: ${salesCallStartTimestamp}`);
					Logger.log(`sales_call_time: ${sales_call_time}`);
					var sales_call_meeting_url = hangoutLink;
					var sales_call_date = Utilities.formatDate(new Date(salesCallStartTimestamp), 'GTM+2', 'yyyy-MM-dd');

					// Get SDR data
					var contact_params = `properties=sdr_firstname`;
					try {
						var contact = Samara.getHubSpotContact(contact_id, contact_params);
						var sdr_firstname = contact.responseObject.properties.sdr_firstname;
					} catch (e) {
						var sdr_firstname = 'mi colega';
					}

					var sdr_is_ea = (sdr = energyAdvisorEmail);
					if (sdr_is_ea == true) {
						sdr_is_eaString = 'true';
					} else {
						sdr_is_eaString = 'false';
					}

					if (skipCalendar == true) {
						skipCalendarString = 'true';
					} else {
						skipCalendarString = 'false';
					}

					if (skipInvoice == true) {
						skipInvoiceString = 'true';
					} else {
						skipInvoiceString = 'false';
					}

					if (skipFusebox == true) {
						skipFuseboxString = 'true';
					} else {
						skipFuseboxString = 'false';
					}

					// Patch Contact with WhatsApp variables
					var contact_data = {
						properties: {
							first_whatsapp_conversation_path: first_whatsapp_conversation_path,
							ready_to_initiate_whatsapp_conversation: ready_to_initiate_whatsapp_conversation,
							sales_call_month: sales_call_month,
							sales_call_day: sales_call_day,
							sales_call_time: sales_call_time,
							sales_call_meeting_url: sales_call_meeting_url,
							sales_call_date: sales_call_date,
							skip_calendar: skipCalendarString,
							sdr_is_ea: sdr_is_eaString,
							skip_invoice: skipInvoiceString,
							skip_fusebox: skipFuseboxString,
						},
					};
					var patchContact = Samara.patchHubSpotContact(contact_id, contact_data);
					if (patchContact.responseCode != 200) {
						Logger.log('ERROR: Samara.patchHubSpotContact(contact_id,contact_data)');
						Logger.log(contact_data);
					} else {
						Logger.log('Success: patchHubSpotContact(contact_id,contact_data)');
					}

					// If skipFirstWhatsApp is false or not found, post WhatsApp conversation at HubSpot
					if (skipFirstWhatsApp != true) {
						var hs_communication_body = getWhatsAppTemplate_1st_contact_with_ea_after_qd(
							sales_call_month,
							sales_call_day,
							sales_call_time,
							sales_call_meeting_url,
							energyAdvisorFirstName,
							customerFirstName,
							sdr_firstname,
							skipCalendar,
							skipInvoice,
							skipFusebox,
							sdr_is_ea,
						);
						var whatsapp_sent_at = Utilities.formatDate(new Date(), 'GTM+2', "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
						var communication_data = {
							properties: {
								hs_communication_channel_type: 'WHATS_APP',
								hs_communication_logged_from: 'CRM',
								hs_communication_body: hs_communication_body,
								hs_timestamp: whatsapp_sent_at,
							},
						};
						Logger.log('communication_data');
						Logger.log(communication_data);
						var postHubSpotCommunication = Samara.postHubSpotCommunication(communication_data);
						if (postHubSpotCommunication.responseCode == 201) {
							var conversation_id = postHubSpotCommunication.responseObject.id;
							Logger.log('Success: postHubSpotCommunication(communication_data)');
							// Associate WhatsApp conversation with Contact and Deal at HubSpot
							var communicationToDealAssociation = Samara.associateCommunicationToDeal(conversation_id, dealId);
							var communicationToContactAssociation = Samara.associateCommunicationToContact(
								conversation_id,
								contact_id,
							);
							Logger.log(`communicationToDealAssociation.responseCode: ${communicationToDealAssociation}`);
							Logger.log(`communicationToContactAssociation.responseCode: ${communicationToContactAssociation}`);
						} else {
							Logger.log('ERROR: Samara.postHubSpotCommunication(communication_data)');
						}
					}
				}

				// Mark Discovery Call row at sheet as completed
				sheet.getRange(i + 2, discoveryCallProcessClosedCol).setValue(true);
				sheet.getRange(i + 2, discovery_call_sourceCol).setValue(discoveryCallSource);
				sheet.getRange(i + 2, energy_advisor_emailCol).setValue(energyAdvisorEmail);
				sheet.getRange(i + 2, salesCallTimestampCol).setValue(salesCallStartTimestamp);
				Logger.log(i + 2 + ' : ' + discoveryCallProcessClosedCol);
			} else if (qualificationStatus === 'Recycle - Bad Timing') {
				sheet.getRange(i + 2, discoveryCallProcessClosedCol).setValue('ERROR');
				var customerFirstName = firstNameArray[i][0];
				var recycleAtDate = salesCallDateArray[i][0];
				var recycleAtTimestamp = new Date(recycleAtDate.getTime() + 11 * 60 * 60 * 1000);

				// Create Recycle Call Task without Owner and Link to Arengu Qualification Call Form
				var qualificationCallNotes = qualificationCallNotesArray[i][0];
				var hs_task_subject = 'Qualification Call (Recycle - Bad Timing)';
				var hs_task_body =
					'<br>Qualification Call Form: https://preview.arengu.page/165538733939169467?deal_id=' +
					dealId +
					'<br/><br>Notes from previous Qualification Call: ' +
					qualificationCallNotes +
					'<br/>';
				var hs_task_status = 'NOT_STARTED';
				var hs_task_priority = 'LOW';
				var hs_task_timestamp = recycleAtTimestamp.getTime();
				var hubspotOwnerId = null;

				var hs_recycleCallTask = Samara.createHubspotTask(
					hs_task_timestamp,
					hubspotOwnerId,
					hs_task_subject,
					hs_task_body,
					hs_task_status,
					hs_task_priority,
				);

				Logger.log(hs_recycleCallTask);

				// Associate Recycle Call Task to Deal and Contact

				var taskToDealAssociation = Samara.associateTaskToDeal(hs_recycleCallTask.id, dealId);
				Logger.log(taskToDealAssociation);

				// Mark Discovery Call row at sheet as completed
				sheet.getRange(i + 2, discoveryCallProcessClosedCol).setValue(true);
				Logger.log(i + 2 + ' : ' + discoveryCallProcessClosedCol);

				// Slack: Schedule Recyle Call Message at #leads
				var channelName = 'leads';
				var textMessage =
					'*Qualification Call (Recycle - Bad Timing) scheduled for today:*\n\n*Name:* ' +
					customerFirstName +
					'\n\n<https://app-eu1.hubspot.com/contacts/25741211/deal/' +
					dealId +
					'|Go to HubSpot deal>';
				var slack_schedule_timestamp = recycleAtTimestamp.getTime() / 1000;

				Samara.slackScheduleMessage(channelName, textMessage, slack_schedule_timestamp);

				Logger.log('Recycled');
			} else if (
				qualificationStatus === 'Recycle - Geography' ||
				qualificationStatus === 'Disqualified - Not interested' ||
				qualificationStatus === 'Disqualified - Bad Contact Data' ||
				qualificationStatus === 'Disqualified - Technical Blocker' ||
				qualificationStatus === 'Disqualified - Fake Lead'
			) {
				// Mark Qualification Call row at sheet as completed
				sheet.getRange(i + 2, discoveryCallProcessClosedCol).setValue('ERROR');
				//sheet.getRange(i+2,discoveryCallProcessClosedCol).setValue(true);
				Logger.log(i + 2 + ' : ' + discoveryCallProcessClosedCol);
			}
		}
	}
}

// How to Schedule a Meeting in Google Meet with Apps Script
// https://www.labnol.org/schedule-google-meeting-calendar-210529
function createSalesCallGoogleMeeting(
	eventStartDate,
	energyManagerDisplayName,
	energyManagerEmail,
	customerEmail,
	hs_link_to_deal,
) {
	// The default calendar where this meeting should be created
	//const calendarId = 'primary';

	// Customer Discovery Call Calendar by hola@samara.energy
	const calendarId = 'c_306kbm0majemgm9jti4hqjs6h4@group.calendar.google.com';

	// Schedule a meeting for May 30, 2022 at 1:45 PM
	// January = 0, February = 1, March = 2, and so on
	//const eventStartDate = new Date(2022, 5, 30, 13, 45);

	// Set the meeting duration to 20 minutes
	const eventDurationInMinutes = 20;
	const eventEndDate = new Date(eventStartDate.getTime());
	eventEndDate.setMinutes(eventEndDate.getMinutes() + eventDurationInMinutes);

	const getEventDate = (eventDate) => {
		// Dates are computed as per the script's default timezone
		const timeZone = Session.getScriptTimeZone();

		// Format the datetime in `full-date T full-time` format
		return {
			timeZone,
			dateTime: Utilities.formatDate(eventDate, timeZone, "yyyy-MM-dd'T'HH:mm:ss"),
		};
	};

	// Email addresses and names (optional) of meeting attendees
	const meetingAttendees = [
		{
			displayName: energyManagerDisplayName,
			email: energyManagerEmail,
			organizer: true,
			responseStatus: 'accepted',
		},
		{
			email: customerEmail,
			responseStatus: 'needsAction',
		},
	];

	// Generate a random id
	const meetingRequestId = Utilities.getUuid();

	// Send an email reminder a day prior to the meeting and also
	// browser notifications15 minutes before the event start time
	const meetingReminders = [
		{
			method: 'email',
			minutes: 24 * 60,
		},
		{
			method: 'popup',
			minutes: 15,
		},
	];

	const { hangoutLink, htmlLink } = Calendar.Events.insert(
		{
			summary: 'Presentación de tu estudio solar con Samara',
			description:
				'En esta reunión vamos a presentarte la oferta de autoconsumo para tu vivienda y resolver cualquier duda que puedas tener en el momento',
			//location: 'Online',
			attendees: meetingAttendees,
			conferenceData: {
				createRequest: {
					requestId: meetingRequestId,
					conferenceSolutionKey: {
						type: 'hangoutsMeet',
					},
				},
			},
			start: getEventDate(eventStartDate),
			end: getEventDate(eventEndDate),
			guestsCanInviteOthers: false,
			guestsCanModify: false,
			status: 'confirmed',
			/*reminders: {
        useDefault: false,
        overrides: meetingReminders,
      }*/
		},
		calendarId,
		{ conferenceDataVersion: 1 },
	);

	Logger.log('Launch meeting in Google Meet: %s', hangoutLink);
	Logger.log('Open event inside Google Calendar: %s', htmlLink);

	return { hangoutLink, htmlLink };
}

function createSendOfferGoogleMeeting(eventStartDate, energyManagerEmail, hs_link_to_deal) {
	// The default calendar where this meeting should be created
	//const calendarId = 'primary';

	// Customer Discovery Call Calendar by hola@samara.energy
	const calendarId = 'c_306kbm0majemgm9jti4hqjs6h4@group.calendar.google.com';

	// Schedule a meeting for May 30, 2022 at 1:45 PM
	// January = 0, February = 1, March = 2, and so on
	//const eventStartDate = new Date(2022, 5, 30, 13, 45);

	// Set the meeting duration to 20 minutes
	const eventDurationInMinutes = 20;
	const eventEndDate = new Date(eventStartDate.getTime());
	eventEndDate.setMinutes(eventEndDate.getMinutes() + eventDurationInMinutes);

	const getEventDate = (eventDate) => {
		// Dates are computed as per the script's default timezone
		const timeZone = Session.getScriptTimeZone();

		// Format the datetime in `full-date T full-time` format
		return {
			timeZone,
			dateTime: Utilities.formatDate(eventDate, timeZone, "yyyy-MM-dd'T'HH:mm:ss"),
		};
	};

	// Email addresses and names (optional) of meeting attendees
	const meetingAttendees = [
		{
			email: energyManagerEmail,
			organizer: true,
			responseStatus: 'accepted',
		},
	];

	// Generate a random id
	const meetingRequestId = Utilities.getUuid();

	// Send an email reminder a day prior to the meeting and also
	// browser notifications15 minutes before the event start time
	const meetingReminders = [
		{
			method: 'email',
			minutes: 24 * 60,
		},
		{
			method: 'popup',
			minutes: 15,
		},
	];

	const { hangoutLink, htmlLink } = Calendar.Events.insert(
		{
			summary: 'Create and send offer without sales call',
			description: `Create and send offer without sales call for deal ${hs_link_to_deal}`,
			//location: 'Online',
			attendees: meetingAttendees,
			conferenceData: {
				createRequest: {
					requestId: meetingRequestId,
					conferenceSolutionKey: {
						type: 'hangoutsMeet',
					},
				},
			},
			start: getEventDate(eventStartDate),
			end: getEventDate(eventEndDate),
			guestsCanInviteOthers: false,
			guestsCanModify: false,
			status: 'confirmed',
			/*reminders: {
        useDefault: false,
        overrides: meetingReminders,
      }*/
		},
		calendarId,
		{ conferenceDataVersion: 1 },
	);

	Logger.log('Launch meeting in Google Meet: %s', hangoutLink);
	Logger.log('Open event inside Google Calendar: %s', htmlLink);

	return { hangoutLink, htmlLink };
}

// Send Growth Partner: Energy Advisor Presentation + Sales Call Email with Sales Call Invite via SendGrid
function sendGrowthPartnerEnergyAdvisorPresentationSalesCallEmail(
	energyAdvisorEmail,
	energyAdvisorFirstName,
	customerEmail,
	customerFirstName,
	salesCallStartTimestamp,
	hangoutLink,
	energy_advisor_html_presentation,
) {
	var salesCallMonthSpanish = monthInSpanish(salesCallStartTimestamp.getMonth());
	var salesCallDay = salesCallStartTimestamp.getDate();
	var salesCallTime = Utilities.formatDate(new Date(salesCallStartTimestamp), 'Europe/Madrid', 'HH:mm');
	Logger.log(`salesCallTime: ${salesCallTime}`);
	Logger.log(`salesCallStartTimestamp: ${salesCallStartTimestamp}`);
	Logger.log(new Date(salesCallStartTimestamp));

	var presentationEmailData = {
		from: {
			email: energyAdvisorEmail,
			name: energyAdvisorFirstName + ' de Samara',
		},
		personalizations: [
			{
				to: [
					{
						email: customerEmail,
					},
				],
				bcc: [
					{
						email: '25741211@bcc.eu1.hubspot.com',
					},
				],
				dynamic_template_data: {
					first_name: customerFirstName,
					EnergyAdvisorFirstName: energyAdvisorFirstName,
					date: salesCallDay.toString(),
					month: salesCallMonthSpanish,
					time: salesCallTime,
					url_hangouts: hangoutLink,
					html_EnergyAdvisor_presentation: energy_advisor_html_presentation,
				},
			},
		],
		template_id: 'd-0ad6c2fa737a4502a8939fad75964503',
		asm: {
			group_id: 18907,
			groups_to_display: [18907],
		},
	};

	var sendPresentationEmail = Samara.sendTransactionalEmailSendGrid(presentationEmailData);
	Logger.log('sendGrowthPartnerEnergyAdvisorPresentationSalesCallEmail');
	//var sendPresentationEmail = "None";
	return sendPresentationEmail;
}

// Send Sales Call Appointment - After Energy Advisor Discovery Call Email via SendGrid
function sendEnergyAdvisorSalesCallEmail(
	energyAdvisorEmail,
	energyAdvisorFirstName,
	customerEmail,
	customerFirstName,
	salesCallStartTimestamp,
	hangoutLink,
	energy_advisor_html_presentation,
) {
	var salesCallMonthSpanish = monthInSpanish(salesCallStartTimestamp.getMonth());
	var salesCallDay = salesCallStartTimestamp.getDate();
	var salesCallTime = Utilities.formatDate(new Date(salesCallStartTimestamp), 'Europe/Madrid', 'HH:mm');
	Logger.log(salesCallTime);

	var presentationEmailData = {
		from: {
			email: energyAdvisorEmail,
			name: energyAdvisorFirstName + ' de Samara',
		},
		personalizations: [
			{
				to: [
					{
						email: customerEmail,
					},
				],
				bcc: [
					{
						email: '25741211@bcc.eu1.hubspot.com',
					},
				],
				dynamic_template_data: {
					first_name: customerFirstName,
					EnergyAdvisorFirstName: energyAdvisorFirstName,
					date: salesCallDay.toString(),
					month: salesCallMonthSpanish,
					time: salesCallTime,
					url_hangouts: hangoutLink,
					html_EnergyAdvisor_presentation: energy_advisor_html_presentation,
				},
			},
		],
		template_id: 'd-722eb9b7c8454dcab19b3a7ba231ef38',
		asm: {
			group_id: 18907,
			groups_to_display: [18907],
		},
	};

	var sendPresentationEmail = Samara.sendTransactionalEmailSendGrid(presentationEmailData);
	Logger.log('sendEnergyAdvisorSalesCallEmail');
	//var sendPresentationEmail = "None";
	return sendPresentationEmail;
}

function columnNotFound(colName) {
	Logger.log('Column not found: ' + colName);
}

function testAlertsFunction() {
	const alertsSalesChannelName = 'alerts_sales';
	var messageResponse = Samara.slackPostMessage(alertsSalesChannelName, 'Test Message');
	//var message = response.;
	var message = JSON.parse(messageResponse.response.getContentText());
	var channelId = message.channel;
	var messageTs = message.ts.toString().replace('.', '');
	var messageLink = 'https://samarahablar.slack.com/archives/' + channelId + '/p' + messageTs;
	Logger.log(messageLink);
	Logger.log(message);
}

function changeHourInDate(inputDate, inputHour) {
	// inputDate: Date
	// inputHour: integer

	const minutesToMilisecons = 60 * 1000;
	const hoursToMilisecons = 60 * minutesToMilisecons;

	var outputDate = new Date(
		inputDate.getTime() -
			inputDate.getHours() * hoursToMilisecons -
			inputDate.getMinutes() * minutesToMilisecons -
			inputDate.getSeconds() * 1000 -
			inputDate.getMilliseconds() +
			inputHour * hoursToMilisecons,
	);
	return outputDate;
}

function addWorkingDays(startDate, numDays) {
	var daysToAdd = numDays;
	var d = new Date(startDate.getTime());

	while (daysToAdd > 0) {
		d.setDate(d.getDate() + 1);
		if (d.getDay() != 0 && d.getDay() != 6) {
			daysToAdd--;
		}
	}
	return d;
}
