import React from "react";
import styled from "styled-components";
import { CommonContainer, CommonWrapper } from "../styles/common";
import { moneyComma } from "../libs/utils";
const Container = styled(CommonContainer)`
  flex: 1;
`;

const Title = styled.div``;

const Wrapper = styled(CommonWrapper)``;
const Table = styled.table`
  width: 100%;
`;

const Tbody = styled.tbody`
  overflow: scroll;
`;
const TbodyTr = styled.tr``;

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
    return data.map((item, index) => (
      <TbodyTr key={index}>
        <td>{item.contDtm}</td>
        <td>{moneyComma(item.contPrice)}</td>
        <td style={{ color: item.updn === "up" ? "red" : "blue" }}>
          {item.contQy} BTC
        </td>
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
              <th>가격(KRW)</th>
              <th>수량</th>
            </tr>
          </thead>
          {transaction && Object.keys(transaction).includes(id) && (
            <Tbody>{renderList(Object.values(transaction[id]))}</Tbody>
          )}
        </Table>
      </Wrapper>
    </Container>
  );
};

export default Transaction;
