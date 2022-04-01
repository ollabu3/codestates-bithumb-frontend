import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { SubscribeType, Symbols, TickerTypes, OrderType } from "../types/type";

import Chart from "../components/Chart";
import Transaction from "../components/Transaction";
import SymbolList from "../components/SymbolList";
import OrderBook from "../components/OrderBook";

const Container = styled.div`
  width: 1300px;
  margin: auto;
  padding-top: 10px;
`;

const FlexRow = styled.div`
  display: flex;
  height: 500px;
`;

const Home = ({ match }) => {
  let ws = useRef(null);
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id ? params.id.slice(1) : Symbols.BTC_KRW;

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
