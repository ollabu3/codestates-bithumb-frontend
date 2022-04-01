import styled from "styled-components";

export const CommonContainer = styled.section`
  width: 100%;
  padding: 10px;
`;

export const CommonWrapper = styled.div`
  width: 100%;
  border-radius: 8px;
  height: 100%;
`;

export const Mum = styled.td`
  color: ${(props) => (props > 0 ? "red" : "blue")};
`;
