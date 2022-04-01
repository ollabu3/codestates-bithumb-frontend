import styled from "styled-components";
import { CommonContainer, CommonWrapper } from "../styles/common";

const Container = styled(CommonContainer)`
  flex: 1;
  background-color: orange;
`;

const Wrapper = styled(CommonWrapper)`
  background-color: blue;
`;

const Transaction = () => {
  return (
    <Container>
      <Wrapper></Wrapper>
    </Container>
  );
};

export default Transaction;
