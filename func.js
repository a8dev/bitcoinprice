const fdk=require('@autom8/fdk');
const a8=require('@autom8/js-a8-fdk')
const bitcoinChart=require('./bitcoin-chart')

let timeRange = '15m';

fdk.handle(function(input){
  if (input.timeRange) {
    timeRange = input.timeRange;
  }

  return bitcoinChart.chart(timeRange)
  	.then(link => { 
		return { "chart": link }
	})
  	.catch(err => { 
		return { "error": err }
	})
})

fdk.slack(function(result) {
	let responseType = "in_channel"
	const blocks = []

	if (!result.error) {
		blocks.push({
			"type": "image",
			"title": {
				"type": "plain_text",
				"text": "Current Bitcoin Price",
				"emoji": true
			},
			"image_url": result.chart,
			"alt_text": "bitcoinprice"
		})
	} else {
		responseType = "ephemeral"
		blocks.push({
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Error generating chart."
			}
		})
	}

	return {
		"response_type": responseType,
		"blocks": blocks
	}
})

fdk.discord(function(result){
	return bitcoinChart.chart(timeRange)
		.then(link => {
		    return {
		        "embed": {
					"image": {
						"url": link
					} 
		        }
		    }
		})
		.catch(err => {
			return {
		        "content": "Error generating chart."
		    }
		})
})

