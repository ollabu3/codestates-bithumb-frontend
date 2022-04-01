import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { SubscribeType, Symbols, TickerTypes, OrderType } from "../types/type";

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
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id ? params.id : Symbols.BTC_KRW;

  const [isConnected, setIsConnected] = useState(false);
  const [ticker, setTicker] = useState();
  const [transaction, setTransaction] = useState([]);
  const [orderBook, setOrderBook] = useState([]);

  // {"symbol" : "BTC_KRW", "orderType" : "ask", "price" : "10596000", "quantity" : "0.5495", "total" : "8"},
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
    setTicker((prev) => ({
      ...prev,
      [data.symbol]: data,
    }));
  };

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
  };

  /*
List: [	{
				"symbol" : "BTC_KRW",
				"orderType" : "ask",		// 주문타입 – bid / ask
				"price" : "10593000",		// 호가
				"quantity" : "1.11223318",	// 잔량
				"total" : "3"				// 건수
			}]
*/
  const getOrderBookData = (data) => {
    const symbol = data.list[0].symbol;
    const dataList = data.list.sort(
      (a, b) => Number(b.price) - Number(a.price)
    );

    const askDataList = dataList.filter(
      (item) => item.orderType === OrderType.ask
    );

    const bidDataList = dataList.filter(
      (item) => item.orderType === OrderType.bid
    );

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
    // 리스트 가지고 와서
    /*
    bid와 ask를 나눈 후
    orderBook : {
      BTC_KRW: {
        ask : {}
        bid : {}
      }.
       ETM_KRW: {
        ask : {}
        bid : {}
      }.
    }
    */
  };

  console.log(orderBook);
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
      <SymbolList ticker={ticker} navigate={navigate} />
      <Chart ticker={ticker} />
      <FlexRow>
        <Transaction transaction={transaction} id={id} />
        <OrderBook orderBook={orderBook} id={id} />
      </FlexRow>
    </Container>
  );
};

export default Home;
