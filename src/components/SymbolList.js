import React from "react";
import styled from "styled-components";
import { CommonContainer } from "../styles/common";

export const Container = styled(CommonContainer)`
  height: 150px;
  border: 1px solid red;
  /* border: 1px solid rgb(224 242 254); */
`;

export const Table = styled.table`
  width: 100%;
`;

export const TbodyTr = styled.tr`
  cursor: pointer;
  &:hover {
    background-color: rgb(224 242 254);
  }
`;

const SymbolList = () => {
  return (
    <Container>
      <Table>
        <thead>
          <tr>
            <th>자산</th>
            <th>시세(KRW)</th>
            <th>변동률</th>
            <th>거래금액</th>
          </tr>
        </thead>
        <tbody>
          <TbodyTr>
            <td>비트코인</td>
            <td>55,612,000</td>
            <td>-1,018,000 (-10%)</td>
            <td>232323232332원</td>
          </TbodyTr>
          <TbodyTr>
            <td>비트코인</td>
            <td>55,612,000</td>
            <td>-1,018,000 (-10%)</td>
            <td>232323232332원</td>
          </TbodyTr>
        </tbody>
      </Table>
    </Container>
  );
};

export default SymbolList;
