import styled from 'styled-components'
import { createGlobalStyle } from 'styled-components'
import Image from 'next/image'
import demoImg from '../public/images/demo.png'
import { launchesAPI } from '../api/space-api'
import InfiniteLoader from 'react-infinite-loader'
import { useSWRInfinite } from "swr"
import Head from 'next/head'
import { LaunchType } from '../types/types'
import { APIResponseType } from '../api/api'
import { GetStaticProps } from 'next'
import ScrollToTop from '../components/back-to-top'

const GlobalStyle = createGlobalStyle`
  body {
    padding:0;
    margin:0;
    background:#1E1E1E;
  }
`

const Container = styled.div`
  display:block;
  width:100%;
  padding:15px;
  box-sizing:border-box;
`

const Title = styled.h1`
  text-align:center;
  color: #fff;
  font-size: 40px;  
`

const Table = styled.table`
  border-collapse: collapse;
  border-spacing: 0;
  width:100%;
  padding:0;
  margin:0 auto;
  border:1px solid #000;
  background:#fff;
  tbody tr:nth-child(2n-1) {
    background:#eee;
  }
  tbody tr:hover {
    background:#ddd;
  }
  th, td {
    padding:5px;
    border:1px solid #000;
    font-family:verdana;
    font-size:14px;
  }  
  td:first-child {
    width:5%;
  }
  td:nth-child(2n) {
    text-align:center;
  }  
  td:last-child {
    text-align:center;
  }

  @media screen and (max-width:480px){
    th:nth-child(3), td:nth-child(3) {
      display:none;
    }

    td:first-child {
      width:20%;
    }
  }
`

const Status = styled.td<{ status: boolean }>`
  background: ${props => props.status ? 'green' : props.status != null && 'red'};
  color: ${props => props.status == null ? 'black' : 'white'};
  font-weight: 600;
`

type PropsType = {
  launches: APIResponseType
}

const Home: React.FC<PropsType> = ({ launches }) => {

  // client-side request to infinity load more on scroll (next pages from API)
  const fetcher = (page: number) => launchesAPI.getLaunches(page)
  const { data, size, setSize } = useSWRInfinite(index => (index + 1).toString(), fetcher)
  
  let docs: Array<LaunchType> = []

  if (size > 1 && data) {
    for (let i = 0; i < data.length; i++) {
      docs = docs.concat(data[i].docs)
    }
  }

  const state = size > 1 ? docs : launches.docs

  return (
    <Container>
      <GlobalStyle />
      <Head>
        <title>SpaceX launches</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="shortcut icon" href="images/favicon.ico" />
      </Head>
      <Title>SpaceX launches</Title>
      <Table>
        <thead>
          <tr>
            <th>Patch</th>
            <th>Ship name</th>
            <th>Mission disc</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {state.map((launch) => (
            <tr key={launch.name}>
              <td><Image
                src={launch.links.patch.small || demoImg}
                alt="Rocket img"
                width={100}
                height={100}
                layout="responsive"
              /></td>
              <td>{launch.name}</td>
              <td>{launch.details}</td>
              <Status status={launch.success}>{launch.success ? 'done': launch.success != null && 'fail'}</Status>
              <td>
                {
                  launch.date_unix && new Date(launch.date_unix * 1000).toLocaleString('ru', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'
                  }).replace(',', '')
                }
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {launches.totalDocs !== state.length && <InfiniteLoader onVisited={() => setSize(size + 1)} />}
      {size > 1 && <ScrollToTop/>}
    </Container>
  )
}

export default Home


// fetching external data for pre-rendering (first page from API)
export const getStaticProps: GetStaticProps = async () => {

  const launches = await launchesAPI.getLaunches(1)

  return {
    props: {
      launches: launches,
    },
  };
}
