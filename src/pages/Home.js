import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { SubscribeType, Symbols, TickerTypes } from "../types/type";

import Chart from "../components/Chart";
import Transaction from "../components/Transaction";
import SymbolList from "../components/SymbolList";
import OrderBook from "../components/OrderBook";

const Container = styled.div`
  width: 1300px;
  margin: auto;
`;

const FlexRow = styled.div`
  display: flex;
  height: 500px;
`;

const Home = () => {
  let ws = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [ticker, setTicker] = useState();
  const [transaction, setTransaction] = useState({});
  const [orderBook, setOrderBook] = useState({});
  const createWebSocket = async () => {
    try {
      ws.current = new WebSocket("wss://pubwss.bithumb.com/pub/ws");
      ws.current.onopen = (e) => {
        setIsConnected((isConnected) => !isConnected);
        console.log("onopen ==== ", e);
      };
    } catch (err) {
      setIsConnected(false);
      console.error("ERROR!! ===", err.message);
    }
  };

  const getTickerData = (data) => {
    setTicker((prev) => ({
      ...prev,
      [data.symbol]: data,
    }));
  };

  /*
    {
	"type" : "transaction",
	"content" : {
		"list" : [
			{
				"symbol" : "BTC_KRW",					// 통화코드
				"buySellGb" : "1",							// 체결종류(1:매도체결, 2:매수체결)
				"contPrice" : "10579000",					// 체결가격
				"contQty" : "0.01",							// 체결수량
				"contAmt" : "105790.00",					// 체결금액
				"contDtm" : "2020-01-29 12:24:18.830039",	// 체결시각
				"updn" : "dn"								// 직전 시세와 비교 : up-상승, dn-하락
			}
		]
	}
}

BTC_KRW : [],
ETC_KRW: [],
    */
  const getTransactionData = (data) => {
    const symbol = data.list[0].symbol;
    const dataList = data.list.reverse();
    setTransaction((prev) =>
      prev[symbol]
        ? {
            ...prev,
            [symbol]: [...dataList, ...prev[symbol]],
          }
        : { ...prev, [symbol]: [...dataList] }
    );

    console.log(
      "==============================================================================================================================="
    );
  };

  /*
  {
	"type" : "orderbookdepth",
		"content" : {
		"list" : [
			{
				"symbol" : "BTC_KRW",
				"orderType" : "ask",		// 주문타입 – bid(매수가격) / ask(매도가격) 
				"price" : "10593000",		// 호가
				"quantity" : "1.11223318",	// 잔량
				"total" : "3"				// 건수
			},
			{"symbol" : "BTC_KRW", "orderType" : "ask", "price" : "10596000", "quantity" : "0.5495", "total" : "8"},
			{"symbol" : "BTC_KRW", "orderType" : "ask", "price" : "10598000", "quantity" : "18.2085", "total" : "10"},
			{"symbol" : "BTC_KRW", "orderType" : "bid", "price" : "10532000", "quantity" : "0", "total" : "0"},
			{"symbol" : "BTC_KRW", "orderType" : "bid", "price" : "10572000", "quantity" : "2.3324", "total" : "4"},
			{"symbol" : "BTC_KRW", "orderType" : "bid", "price" : "10571000", "quantity" : "1.469", "total" : "3"},
			{"symbol" : "BTC_KRW", "orderType" : "bid", "price" : "10569000", "quantity" : "0.5152", "total" : "2"}
		],
		"datetime":1580268255864325		// 일시
	}
}
  */

  const getOrderBookData = (data) => {};

  useEffect(() => {
    createWebSocket();
  }, []);

  useEffect(() => {
    if (ws.current && isConnected) {
      ws.current.send(
        JSON.stringify({
          type: SubscribeType.ticker,
          symbols: Object.keys(Symbols),
          tickTypes: [TickerTypes["24H"]],
        })
      );
      ws.current.send(
        JSON.stringify({
          type: SubscribeType.transaction,
          symbols: Object.keys(Symbols),
        })
      );

      ws.current.send(
        JSON.stringify({
          type: SubscribeType.orderbookdepth,
          symbols: Object.keys(Symbols),
        })
      );

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case SubscribeType.ticker:
            getTickerData(data.content);
            break;
          case SubscribeType.transaction:
            getTransactionData(data.content);
            break;
          case SubscribeType.orderbookdepth:
            getOrderBookData(data.content);
            break;
          default:
            console.error("Type ERROR");
            break;
        }
      };
    }
  }, [isConnected]);
  return (
    <Container>
      <SymbolList ticker={ticker} />
      <Chart ticker={ticker} />
      <FlexRow>
        <Transaction ws={ws} isConnected={isConnected} />
        <OrderBook ws={ws} isConnected={isConnected} />
      </FlexRow>
    </Container>
  );
};

export default Home;
