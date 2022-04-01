import styled from "styled-components";

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
  return (
    <Container>
      <SymbolList />
      <Chart />
      <FlexRow>
        <Transaction />
        <OrderBook />
      </FlexRow>
    </Container>
  );
};

export default Home;
