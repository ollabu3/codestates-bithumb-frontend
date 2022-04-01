import React from "react";
import styled from "styled-components";
import { CommonContainer, Mum } from "../styles/common";
import { moneyComma, MoneyUnit } from "../libs/utils";

const Container = styled(CommonContainer)`
  height: 150px;
  border: 1px solid red;
  /* border: 1px solid rgb(224 242 254); */
`;

const Table = styled.table`
  width: 100%;
`;

const TbodyTr = styled.tr`
  cursor: pointer;
  &:hover {
    background-color: rgb(224 242 254);
  }
`;

const TbodyTd = styled(Mum)``;
const SymbolList = ({ ticker }) => {
  const renderList = (value) => {
    /* 
자산: symbol
시세 : closePrice 
변동률 :  chgAmt (chgRate)
거래금액 : value 
*/
    return Object.values(value).map((item) => (
      <TbodyTr key={item.symbol}>
        {console.log(typeof item.chgAmt)}
        <td>{item.symbol}</td>
        <TbodyTd>{moneyComma(item.closePrice)}</TbodyTd>
        <TbodyTd>
          {moneyComma(item.chgAmt)} ({item.chgRate})
        </TbodyTd>
        <TbodyTd>{MoneyUnit(item.value)}</TbodyTd>
      </TbodyTr>
    ));
  };

  return (
    <Container>
      <Table>
        <thead>
          <tr>
            <th>자산</th>
            <th>시세(KRW)</th>
            <th>변동률(전일대비)</th>
            <th>거래금액(24H)</th>
          </tr>
        </thead>
        {ticker && <tbody>{renderList(ticker)}</tbody>}
      </Table>
    </Container>
  );
};

export default SymbolList;
