import styled from "styled-components";
import { CommonContainer, CommonWrapper } from "../styles/common";

const Container = styled(CommonContainer)`
  height: 500px;
  border: 1px solid blue;
`;

const Wrapper = styled(CommonWrapper)`
  background-color: blue;
`;

const Chart = () => {
  return (
    <Container>
      <Wrapper>Chart</Wrapper>
    </Container>
  );
};

export default Chart;
