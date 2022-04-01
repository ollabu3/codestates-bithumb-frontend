import styled from "styled-components";
import { CommonContainer, CommonWrapper } from "../styles/common";

const Container = styled(CommonContainer)`
  flex: 1;
  background-color: green;
`;

const Wrapper = styled(CommonWrapper)`
  background-color: pink;
`;

const OrderBook = () => {
  return (
    <Container>
      <Wrapper></Wrapper>
    </Container>
  );
};

export default OrderBook;
