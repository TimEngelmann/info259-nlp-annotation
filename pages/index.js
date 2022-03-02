import Head from "next/head";
import Image from "next/image";
import { useContext } from "react";
import { Button, Row, Col, Input, Space, Radio, Card, List, Layout, Menu } from "antd";

import Link from "next/link";
import { AuthUserContext } from "../utils/auth";

import { archetypes } from "../components/constants";

const { Meta } = Card
const { Header, Content, Footer } = Layout;

export default function Home() {
  const userContext = useContext(AuthUserContext);

  var annotation_data = { 
    "document": "To Kara's astonishment, she discovers that a portal has opened in her bedroom closet and two goblins have fallen through! They refuse to return to the fairy realms and be drafted for an impending war. In an attempt to roust the pesky creatures, Kara falls through the portal, smack into the middle of a huge war. Kara meets Queen Selinda, who appoints Kara as a Fairy Princess and assigns her an impossible task: to put an end to the war using her diplomatic skills. \n All's Fairy In Love And War is the eighth book in Avalon: Web of Magic, a twelve-book fantasy series for middle grade readers. Through their magical journey, the teenage heroines discover who they really are . . . and run into plenty of good guys, bad guys, and cute guys. Out of print for two years, Seven Seas is pleased to return the Avalon series to print in editions targeted for today's readers, with new manga-style covers and interior illustrations.",
    "first_name": "Kara",
    "last_name": "",
    "gender": "female",
    "archetype": "",
    "annotator": "",
  }

  return (
    <Layout className="layout">
      <Head>
        <title>INFO259</title>
        <meta name="description" content="Annotation Project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header>
        <div className="logo" />
        <div>
          {!userContext.user && (
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          )}
          {userContext.user && (
            <div>
              <Button onClick={() => userContext.logout()}>
                {userContext.userDoc.name}, Logout
              </Button>
            </div>
          )}
        </div>
      </Header>
      <Content style={{ padding: '0 50px', minHeight: 'calc(100vh - 65px)', margin:"auto"}}>
        <div className="site-layout-content">
          <h1>INFO259 Character Annotation</h1>
          <Row>
            <Col span={16} style={{paddingRight: "20px"}}>
              <p>{annotation_data.document}</p>
            </Col>
            <Col span={8} style={{textAlign:"center"}}>
              <Space style={{paddingBottom:"10px"}}>
                <Input placeholder={annotation_data.first_name}></Input>
                <Input placeholder={annotation_data.last_name}></Input>
              </Space>
              <Radio.Group defaultValue={annotation_data.gender} buttonStyle="solid" style={{paddingBottom:"10px"}}>
                <Radio.Button value="male">Male</Radio.Button>
                <Radio.Button value="other">Other</Radio.Button>
                <Radio.Button value="female">Female</Radio.Button>
              </Radio.Group>
              <List
                grid={{ gutter: 5, column: 3 }}
                dataSource={archetypes}
                renderItem={item => (
                  <List.Item>
                    <Card hoverable 
                      style={{width:"100%", height:"70px", marginBottom:"-10px", textAlign:"center"}}
                      bodyStyle={{paddingLeft: "0", paddingRight: "0"}}>
                        {item.title}
                    </Card>
                  </List.Item>
                )}
              />
              <Card hoverable 
                style={{width:"100%", height:"35px", textAlign:"center"}}
                bodyStyle={{paddingLeft: "0", paddingRight: "0", paddingTop:"6px"}}>
                  None
              </Card>
              <Row justify="end" style={{paddingTop:"30px", paddingBottom:"10px"}}>
                <Button type="primary">
                  Submit
                </Button>
              </Row>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
}
