import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import { Button, Row, Col, Input, Space, Radio, Card, List, Layout, Spin, Typography } from "antd";

import Link from "next/link";
import { AuthUserContext } from "../utils/auth";
import { getAnnotations, getAnnotationsLive, updateAnnotation } from "../utils/firebase";

import { archetypes } from "../components/constants";

const { Header, Content } = Layout;
const { Text } = Typography;

function highlightedString(original_text, first_name, last_name) {
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
    return splitted_string.join('');
  } else{
    return original_text;
  }
}

export default function Home() {
  const userContext = useContext(AuthUserContext);
  const [annotationIdx, setAnnotationIdx] = useState(0)
  const [annotationsArray, setAnnotationArray] = useState([])
  const [annotationState, setAnnotationState] = useState({})

  useEffect(() => {
    getAnnotations(annotationsArray, setAnnotationArray)
  }, []);

  useEffect(() =>{
    console.log("I want to look at: ", annotationIdx)
    if (annotationsArray.length > annotationIdx){
      console.log("Now lets set it: ", annotationIdx)
      setAnnotationState(annotationsArray[annotationIdx])
    }
  }, [annotationsArray]);

  useEffect(() => {
    if(Object.keys(annotationState).length !== 0){
      const highlighted_text = highlightedString(annotationState.description, annotationState.first_name, annotationState.last_name)
      const decriptionText = document.getElementById("descriptionText");
      decriptionText.innerHTML = highlighted_text;
    }
  }, [annotationState]);

  const checkAnnotation = () => {
    if (annotationState.gender == "" || annotationState.archetype == "" || userContext.userDoc.name == ""){
      return true
    } 
    return false
  }

  const submitAnnotation = () => {
    updateAnnotation(annotationState, userContext.userDoc.name)
    annotationState.submitted = true
    annotationsArray[annotationIdx] = annotationState
    setAnnotationIdx(annotationIdx + 1)
  }

  const previousAnnotation = () => {
    annotationsArray[annotationIdx] = annotationState
    setAnnotationIdx(annotationIdx - 1)
  }

  const nextAnnotation = () => {
    setAnnotationIdx(annotationIdx + 1)
  }

  useEffect(() =>{
    if (annotationsArray.length > annotationIdx){
      setAnnotationState(annotationsArray[annotationIdx])
    } else{
      if(annotationIdx > 0){
        getAnnotations(annotationsArray, setAnnotationArray)
      }
    }
  }, [annotationIdx]);

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
        {Object.keys(annotationState).length === 0 && (<Spin style={{marginTop: "50px"}}/>)}
        {Object.keys(annotationState).length !== 0 && (
          <div className="site-layout-content">
            <h1>INFO259 Character Annotation</h1>
            <Row>
              <Col span={16} style={{paddingRight: "20px", textAlign:"justify"}}>
                <Text id="descriptionText"/>
              </Col>
              <Col span={8} style={{textAlign:"center"}}>
                <Space style={{paddingBottom:"10px"}}>
                  <Input 
                    id="first_name" 
                    value={annotationState.first_name} 
                    placeholder={"First Name"} 
                    onChange={(e) => setAnnotationState({... annotationState, first_name: e.target.value})}
                  />
                  <Input 
                    id="last_name" 
                    value={annotationState.last_name} 
                    placeholder={"Last Name"} 
                    onChange={(e) => setAnnotationState({... annotationState, last_name: e.target.value})}
                  />
                </Space>
                <Radio.Group value={annotationState.gender} buttonStyle="solid" style={{paddingBottom:"10px"}} onChange={(e) => setAnnotationState({... annotationState, gender: e.target.value})}>
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
                          backgroundColor: annotationState.archetype == item.title ? '#1890ff' : '',
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
                    backgroundColor: annotationState.archetype == 'None' ? '#1890ff' : '',
                    color: annotationState.archetype == 'None' ? 'white' : ''
                  }}
                  bodyStyle={{paddingLeft: "0", paddingRight: "0", paddingTop:"6px"}}>
                    None
                </Card>
                <Row justify="space-between" style={{paddingTop:"30px", paddingBottom:"10px"}}>
                  <Button 
                    type="secondary" 
                    onClick={() => previousAnnotation()}
                    disabled={annotationIdx == 0 ? true : false}>
                    Previous
                  </Button>
                  {annotationState.submitted && (
                    <Button 
                      type="secondary" 
                      onClick={() => nextAnnotation()}>
                      Next
                    </Button>
                  )}
                  {!annotationState.submitted && (
                    <Button 
                      type="primary" 
                      onClick={() => submitAnnotation(annotationState)}
                      disabled={checkAnnotation()}>
                      Submit
                    </Button>
                  )}
                </Row>
              </Col>
            </Row>
          </div>
        )}
      </Content>
    </Layout>
  );
}
