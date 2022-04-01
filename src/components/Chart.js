import React, { useEffect, useState, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { moneyComma } from "../libs/utils";
import styled from "styled-components";
import { CommonContainer, CommonWrapper } from "../styles/common";
import { Symbols, SubscribeType, TickerTypes } from "../types/type";

const Container = styled(CommonContainer)`
  height: 500px;
`;

const Wrapper = styled(CommonWrapper)`
  overflow-x: scroll;
`;

// 일자, 시간, 시가, 종가, 저가, 고가 등의 데이터를 다양한 차트 라이브러리를 활용해서 변동 곡선을 나타냅니다.
const MainChart = ({ id }) => {
  let ws = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chart, setChart] = useState({
    BTC_KRW: {
      openPrice: [],
      closePrice: [],
      highPrice: [],
      lowPrice: [],
    },
  });
  const [labels, setLabels] = useState([]);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const data = {
    labels: labels,
    datasets: [
      {
        label: "시가",
        data: Boolean(chart[id].openPrice) ? chart[id].openPrice : ["0"],
        borderColor: "rgb(202 138 4)",
        backgroundColor: "rgb(202 138 4)",
      },
      {
        label: "종가",
        data: Boolean(chart[id].closePrice) ? chart[id].closePrice : ["0"],

        borderColor: "rgb(192 38 211)",
        backgroundColor: "rgb(192 38 211)",
      },
      {
        label: "고가",
        // data: ["0"],
        data: Boolean(chart[id].highPrice) ? chart[id].highPrice : ["0"],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "저가",
        data: Boolean(chart[id].lowPrice) ? chart[id].lowPrice : ["0"],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

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

  const getChartData = (data) => {
    const symbol = data.symbol;
    setLabels((prev) => [...prev, data.time]);
    setChart((prev) =>
      prev[symbol]
        ? {
            ...prev,
            [symbol]: {
              openPrice: [
                ...prev[symbol].openPrice,
                moneyComma(data.openPrice),
              ],
              closePrice: [
                ...prev[symbol].closePrice,
                moneyComma(data.closePrice),
              ],
              highPrice: [
                ...prev[symbol].highPrice,
                moneyComma(data.highPrice),
              ],
              lowPrice: [...prev[symbol].lowPrice, moneyComma(data.lowPrice)],
            },
          }
        : {
            ...prev,
            [symbol]: {
              openPrice: [moneyComma(data.openPrice)],
              closePrice: [moneyComma(data.closePrice)],
              highPrice: [moneyComma(data.highPrice)],
              lowPrice: [moneyComma(data.lowPrice)],
            },
          }
    );
  };
  useEffect(() => {
    if (isConnected) {
      ws.current.send(
        JSON.stringify({
          type: "ticker",
          symbols: Object.keys(Symbols),
          tickTypes: [TickerTypes["24H"]],
        })
      );

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case SubscribeType.ticker:
            getChartData(data.content);
            break;
          default:
            console.error("Type ERROR");
            break;
        }
      };
    }
  }, [isConnected]);

  useEffect(() => {
    createWebSocket();
  }, []);

  return (
    <Container>
      <Wrapper>
        {chart && Object.keys(chart).includes(id) && (
          <Line
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        )}
      </Wrapper>
    </Container>
  );
};

export default MainChart;
