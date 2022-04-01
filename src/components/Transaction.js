import { useEffect, useState } from "react";

import styled from "styled-components";
import { CommonContainer, CommonWrapper } from "../styles/common";
import { SubscribeType, Symbols } from "../types/type";

const Container = styled(CommonContainer)`
  flex: 1;
`;

const Title = styled.div``;

const Wrapper = styled(CommonWrapper)``;
const Table = styled.table`
  width: 100%;
`;

const TbodyTr = styled.tr`
  overflow: scroll;
  &:hover {
    background-color: rgb(224 242 254);
  }
`;

const Transaction = ({ transaction, id }) => {
  const renderList = (data) => {
    /*
  {
				"contDtm" : "2020-01-29 12:24:18.830039",	// 체결시각
				"contPrice" : "10579000",					// 체결가격
				"contQty" : "0.01",							// 체결수량
				"updn" : "dn"								// 직전 시세와 비교 : up-상승, dn-하락
			}
    */
    return data.map((item) => (
      <TbodyTr key={item.symbol}>
        <td>{item.contDtm.split(" ")[1]}</td>
        <td>{item.contPrice}</td>
        <td>{item.contQty}</td>
      </TbodyTr>
    ));
  };

  return (
    <Container>
      <Wrapper>
        <Title>체결내역</Title>
        <Table>
          <thead>
            <tr>
              <th>시간</th>
              <th>가격</th>
              <th>수량</th>
            </tr>
          </thead>
          {transaction && Object.keys(transaction).includes(id) && (
            <tbody>{renderList(Object.values(transaction[id]))}</tbody>
          )}
        </Table>
      </Wrapper>
    </Container>
  );
};

export default Transaction;
