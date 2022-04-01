import { Fragment } from "react";
import styled from "styled-components";
import { CommonContainer, CommonWrapper } from "../styles/common";

const Container = styled(CommonContainer)`
  flex: 1;
`;

const Wrapper = styled(CommonWrapper)``;

const TitleWrapper = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 5px;
`;
const Title = styled.div`
  font-size: 30px;
  margin-right: 20px;
`;
const PercentBox = styled.div`
  background-color: #4386f9;
  padding: 0 3px;
  width: 56px;
  text-align: center;
  border-radius: 4px;
  font-size: 12px;
  color: #ffffff;
  height: 20px;
`;

const TradeWrapper = styled.div`
  display: flex;
`;

const Trade = styled.table`
  flex: 1;
  padding: 0 10px;
`;

const TradeTitle = styled.th`
  text-align: left;
  font-size: 12px;
`;
const TradeContent = styled.td`
  font-size: 12px;
`;

const Info = ({ ticker, id }) => {
  const TitleItem = (data) => {
    console.log("Data ===", data);
    return (
      <TitleWrapper>
        <Title>{data.closePrice}</Title>
        <PercentBox>{data.chgRate}%</PercentBox>
      </TitleWrapper>
    );
  };

  const TradeItem = (title, content) => {
    return (
      <tr>
        <TradeTitle scope="row">{title}</TradeTitle>
        <TradeContent>{content}</TradeContent>
      </tr>
    );
  };
  const TradeList = (data) => {
    return (
      <TradeWrapper>
        <Trade>
          <tbody>
            {TradeItem("거래량(24H)", data.volume)}
            {TradeItem("거래금액", data.value)}
            {TradeItem("체결강도", data.volumePower)}
          </tbody>
        </Trade>
        <Trade>
          <tbody>
            {TradeItem("고가(당일)", data.highPrice)}
            {TradeItem("저가(당일)", data.lowPrice)}
            {TradeItem("전일증가", data.prevClosePrice)}
          </tbody>
        </Trade>
      </TradeWrapper>
    );
  };

  console.log("ticker ===", ticker);
  return (
    <Container>
      <Wrapper>
        {ticker && Object.keys(ticker).includes(id) && (
          <Fragment>
            {TitleItem(ticker[id])}
            {TradeList(ticker[id])}
          </Fragment>
        )}
      </Wrapper>
    </Container>
  );
};

export default Info;
