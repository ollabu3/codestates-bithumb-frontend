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

  useEffect(() => {
    createWebSocket();
  }, []);

  useEffect(() => {
    if (isConnected) {
      ws.current.send(
        JSON.stringify({
          type: SubscribeType.ticker,
          symbols: [Symbols.BTC_KRW, Symbols.ETH_KRW],
          tickTypes: [TickerTypes["24H"]],
        })
      );
      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "ticker") {
          setTicker((prev) => ({
            ...prev,
            [data.content.symbol]: data.content,
          }));
        }
      };
    }
  }, [isConnected]);

  console.log("ticker ===", ticker);

  return (
    <Container>
      <SymbolList ticker={ticker} />
      <Chart ticker={ticker} />
      <FlexRow>
        <Transaction />
        <OrderBook />
      </FlexRow>
    </Container>
  );
};

export default Home;
