// This file is responsible for processing the raw stock data received from the server before
// it throws it back to the graph component's table to render
import { ServerRespond } from './DataStreamer';

// Modify row interface to match the new schema in Graph.tsx. Outlines structure of return object
// of the only function in the DataManipulator class (generateRow)
export interface Row {
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
}


export class DataManipulator {
  // Update generateRow to properly process raw server data passed to it so that it can return
  // the processed data which will be rendered by the Graph component's table. Computer for
  // price_abc and price_def. Compute for ratio using the two computed prices. Set lower and upper
  // bounds and trigger_alert. Return value is a single Row object. 
  static generateRow(serverRespond: ServerRespond[]): Row {
    const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
    const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;
    const ratio = priceABC / priceDEF;
    const upperBound = 1 + 0.05;
    const lowerBound = 1 - 0.05;
    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ?
        serverRespond[0].timestamp : serverRespond[1].timestamp,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined,
    };
  }
}
