import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { SubscribeType, Symbols, TickerTypes, OrderType } from "../types/type";

import Chart from "../components/Chart";
import Transaction from "../components/Transaction";
import SymbolList from "../components/SymbolList";
import Info from "../components/Info";

const Container = styled.div`
  width: 1300px;
  margin: auto;
  padding-top: 10px;
`;

const FlexRow = styled.div`
  display: flex;
  height: 500px;
`;

const Home = () => {
  let ws = useRef(null);
  const [id, setId] = useState(Symbols.BTC_KRW);
  const [isConnected, setIsConnected] = useState(false);
  const [ticker, setTicker] = useState();
  const [transaction, setTransaction] = useState([]);
  const [orderBook, setOrderBook] = useState([]);

  const createWebSocket = async () => {
    try {
      ws.current = new WebSocket("wss://pubwss.bithumb.com/pub/ws");
      ws.current.onopen = (e) => {
        setIsConnected((isConnected) => !isConnected);
      };
    } catch (err) {
      setIsConnected(false);
      console.error("ERROR!! ===", err.message);
    }
  };

  const getTickerData = (data) => {
    const symbol = data.symbol;

    setTicker((prev) => ({
      ...prev,
      [symbol]: data,
    }));
  };

  const getTransactionData = (data) => {
    const symbol = data.list[0].symbol;
    const dataList = data.list.reverse().map((item) => {
      const contDtm = item.contDtm.split(" ")[1];

      return {
        contDtm: contDtm.slice(0, 11),
        contPrice: item.contPrice,
        contQy: item.contQty.slice(0, 6),
        updn: item.updn,
      };
    });

    setTransaction((prev) =>
      prev[symbol]
        ? {
            ...prev,
            [symbol]: [...dataList, ...prev[symbol]].slice(0, 20),
          }
        : { ...prev, [symbol]: [...dataList] }
    );
  };

  const getOrderBookData = (data) => {
    const symbol = data.list[0].symbol;
    const dataList = data.list.sort(
      (a, b) => Number(b.price) - Number(a.price)
    );
    const dataFilterList = (type) =>
      dataList.filter((item) => item.orderType === type);
    const askDataList = dataFilterList(OrderType.ask);
    const bidDataList = dataFilterList(OrderType.bid);
    /*
	{
    가격의 수량이 0이되면 빼줘야 한다.
				"symbol" : "BTC_KRW",
				"orderType" : "ask",		// 주문타입 – bid / ask
				"price" : "10593000",		// 호가
				"quantity" : "1.11223318",	// 잔량
				"total" : "3"				// 건수
			},
*/
    setOrderBook((prev) =>
      prev[symbol]
        ? {
            ...prev,
            [symbol]: {
              ask: [...askDataList, ...prev[symbol].ask],
              bid: [...bidDataList, ...prev[symbol].bid],
            },
          }
        : {
            ...prev,
            [symbol]: {
              ask: [...askDataList],
              bid: [...bidDataList],
            },
          }
    );
  };

  useEffect(() => {
    createWebSocket();
  }, []);
  useEffect(() => {
    if (isConnected) {
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
      <SymbolList ticker={ticker} setId={setId} />
      <Chart id={id} />
      <FlexRow>
        <Transaction transaction={transaction} id={id} />
        <Info id={id} ticker={ticker} />
      </FlexRow>
    </Container>
  );
};

export default Home;
