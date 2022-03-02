import Head from "next/head";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { Button, Row, Col, Input, Space, Radio, Card, List, Layout, Menu, Typography } from "antd";

import Link from "next/link";
import { AuthUserContext } from "../utils/auth";

import { archetypes } from "../components/constants";
import { validateCallback } from "@firebase/util";

const { Meta } = Card
const { Header, Content, Footer } = Layout;
const { Text } = Typography;

function highlight(original_text) {
  var inputText = document.getElementById("inputText");
  const first_name = document.getElementById("first_name").value;
  const last_name = document.getElementById("last_name").value;
  
  if (first_name != "" || last_name != ""){
    var splitted_string = []
    var remaining_text = original_text
    var index_first = 0
    var index_last = 0
    var index = 0
    while(index >=0){
      
      index_first = -1
      if (first_name != ""){
        index_first = remaining_text.indexOf(first_name)
      } 

      index_last = -1
      if (last_name != ""){
        index_last = remaining_text.indexOf(last_name)
      }
     
      var index = index_first
      var name = first_name
      var color = 'highlight-first'
      if ((index_first > index_last && index_last >=0) || index_first == -1){
        index = index_last
        name = last_name
        color = 'highlight-last'
      }

      if(index >=0 ){
        splitted_string.push(remaining_text.substring(0,index))
        splitted_string.push("<span class=" + color + ">" + remaining_text.substring(index,index+name.length) + "</span>")
        remaining_text = remaining_text.substring(index+name.length)
      }
    }

    splitted_string.push(remaining_text)
    inputText.innerHTML = splitted_string.join('');
  } else{
    inputText.innerHTML = original_text;
  }
}

export default function Home() {
  const userContext = useContext(AuthUserContext);
  const [annotationState, setAnnotationState] = useState({ 
    "document_original": "To Kara's astonishment, she discovers that a portal has opened in her bedroom closet and two goblins have fallen through! They refuse to return to the fairy realms and be drafted for an impending war. In an attempt to roust the pesky creatures, Kara falls through the portal, smack into the middle of a huge war. Kara meets Queen Selinda, who appoints Kara as a Fairy Princess and assigns her an impossible task: to put an end to the war using her diplomatic skills. \n All's Fairy In Love And War is the eighth book in Avalon: Web of Magic, a twelve-book fantasy series for middle grade readers. Through their magical journey, the teenage heroines discover who they really are . . . and run into plenty of good guys, bad guys, and cute guys. Out of print for two years, Seven Seas is pleased to return the Avalon series to print in editions targeted for today's readers, with new manga-style covers and interior illustrations.",
    "document": "To Kara's astonishment, she discovers that a portal has opened in her bedroom closet and two goblins have fallen through! They refuse to return to the fairy realms and be drafted for an impending war. In an attempt to roust the pesky creatures, Kara falls through the portal, smack into the middle of a huge war. Kara meets Queen Selinda, who appoints Kara as a Fairy Princess and assigns her an impossible task: to put an end to the war using her diplomatic skills. <br> All's Fairy In Love And War is the eighth book in Avalon: Web of Magic, a twelve-book fantasy series for middle grade readers. Through their magical journey, the teenage heroines discover who they really are . . . and run into plenty of good guys, bad guys, and cute guys. Out of print for two years, Seven Seas is pleased to return the Avalon series to print in editions targeted for today's readers, with new manga-style covers and interior illustrations.",
    "first_name": "Kara",
    "last_name": "",
    "gender": "female",
    "archetype": "",
    "annotator": "",
  })

  var annotation_data = { 
    "document_original": "To Kara's astonishment, she discovers that a portal has opened in her bedroom closet and two goblins have fallen through! They refuse to return to the fairy realms and be drafted for an impending war. In an attempt to roust the pesky creatures, Kara falls through the portal, smack into the middle of a huge war. Kara meets Queen Selinda, who appoints Kara as a Fairy Princess and assigns her an impossible task: to put an end to the war using her diplomatic skills. \n All's Fairy In Love And War is the eighth book in Avalon: Web of Magic, a twelve-book fantasy series for middle grade readers. Through their magical journey, the teenage heroines discover who they really are . . . and run into plenty of good guys, bad guys, and cute guys. Out of print for two years, Seven Seas is pleased to return the Avalon series to print in editions targeted for today's readers, with new manga-style covers and interior illustrations.",
    "document": "To Kara's astonishment, she discovers that a portal has opened in her bedroom closet and two goblins have fallen through! They refuse to return to the fairy realms and be drafted for an impending war. In an attempt to roust the pesky creatures, Kara falls through the portal, smack into the middle of a huge war. Kara meets Queen Selinda, who appoints Kara as a Fairy Princess and assigns her an impossible task: to put an end to the war using her diplomatic skills. <br> All's Fairy In Love And War is the eighth book in Avalon: Web of Magic, a twelve-book fantasy series for middle grade readers. Through their magical journey, the teenage heroines discover who they really are . . . and run into plenty of good guys, bad guys, and cute guys. Out of print for two years, Seven Seas is pleased to return the Avalon series to print in editions targeted for today's readers, with new manga-style covers and interior illustrations.",
    "first_name": "Kara",
    "last_name": "",
    "gender": "female",
    "archetype": "",
    "annotator": "",
  }

  useEffect(() => {
    highlight(annotation_data.document)
  });

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
            <Col span={16} style={{paddingRight: "20px", textAlign:"justify"}}>
              <Text id="inputText">{annotation_data.document}</Text>
            </Col>
            <Col span={8} style={{textAlign:"center"}}>
              <Space style={{paddingBottom:"10px"}}>
                <Input id="first_name" defaultValue={annotation_data.first_name} placeholder={"First Name"} onChange={() => highlight(annotation_data.document)}></Input>
                <Input id="last_name" defaultValue={annotation_data.last_name} placeholder={"Last Name"} onChange={() => highlight(annotation_data.document)}></Input>
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
                      id={item.title}
                      onClick={(e) => setAnnotationState({... annotationState, archetype: e.currentTarget.id})}
                      style={{
                        width:"100%", 
                        height:"70px", 
                        marginBottom:"-10px", 
                        textAlign:"center",
                        backgroundColor: annotationState.archetype == item.title ? '#1979FE' : '',
                        color: annotationState.archetype == item.title ? 'white' : ''}}
                      bodyStyle={{
                        paddingLeft: "0", 
                        paddingRight: "0", 
                      }}>
                        {item.title}
                    </Card>
                  </List.Item>
                )}
              />
              <Card hoverable 
                id={'None'}
                onClick={(e) => setAnnotationState({... annotationState, archetype: 'None'})}
                style={{
                  width:"100%", 
                  height:"35px", 
                  textAlign:"center", 
                  backgroundColor: annotationState.archetype == 'None' ? '#1979FE' : '',
                  color: annotationState.archetype == 'None' ? 'white' : ''
                }}
                bodyStyle={{paddingLeft: "0", paddingRight: "0", paddingTop:"6px"}}>
                  None
              </Card>
              <Row justify="end" style={{paddingTop:"30px", paddingBottom:"10px"}}>
                <Button type="primary" onClick={() => console.log(annotationState)}>
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
