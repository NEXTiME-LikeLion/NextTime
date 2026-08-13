import styled from "styled-components";

function HomeHeader() {
  return (
    <>
      <TabName>홈</TabName>
      <Container>
        <Left></Left>
        <Right></Right>
      </Container>
    </>
  );
}

export default HomeHeader;

const TabName = styled.p`
  margin-bottom: 0.75rem;

  color: #fff;
  font-size: 1.25rem;
  font-weight: 800;
  line-height: 140%; /* 1.75rem */
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  /* gap: 1.37rem; */
`;
