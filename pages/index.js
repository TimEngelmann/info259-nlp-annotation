import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import { Button, Row, Col, Input, Space, Radio, Card, List, Layout, Spin, Typography, Result, Popover, Switch, Dropdown, Menu } from "antd";
import { DownOutlined, UserOutlined } from '@ant-design/icons';

import Link from "next/link";
import { AuthUserContext } from "../utils/auth";
import { getAnnotations, getAnnotationsLive, getRelatedAnnotations, updateAnnotation } from "../utils/firebase";

import { archetypes } from "../components/constants";

const { Header, Content } = Layout;
const { Text, Title } = Typography;

function highlightedString(original_text, first_name, last_name) {

  var text = original_text.replaceAll("\n", "<br>")

  if (first_name != "" || last_name != ""){
    var splitted_string = []
    var remaining_text = text
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
    return text;
  }
}

const popoverContent = (item) => (
  <div style={{maxWidth: "300px"}}>
    <Title level={5}>Description</Title>
    <Text>{item.description}</Text>
    <Title level={5}>Strengths</Title>
    <Text>{item.strengths}</Text>
    <Title level={5}>Weaknesses</Title>
    <Text>{item.weaknesses}</Text>
    <Title level={5}>Examples</Title>
    <Text>{item.examples}</Text>
  </div>
);

export default function Home() {
  const userContext = useContext(AuthUserContext);
  const [annotationIdx, setAnnotationIdx] = useState(0)
  const [showDetails, setShowDetails] = useState(true)
  const [annotationsArray, setAnnotationArray] = useState([])
  const [annotationState, setAnnotationState] = useState({})
  const [relatedAnnotations, setRelatedAnnotations] = useState([])
  const [relatedIdx, setRelatedIdx] = useState('0')

  useEffect(() => {
    getAnnotations(userContext.userDoc.annotator_id, annotationsArray, setAnnotationArray)
  }, [userContext]);

  useEffect(() =>{
    if (annotationsArray.length > annotationIdx){
      setAnnotationState(annotationsArray[annotationIdx])
    }
  }, [annotationsArray]);

  useEffect(() => {
    if(Object.keys(annotationState).length > 1){
      if(annotationState.adjudicated === "adjudicated"){
        if(relatedAnnotations.length === 0 || relatedAnnotations[0].book_id !== annotationState.book_id){
          getRelatedAnnotations(annotationState, setRelatedAnnotations)
        }
      }

      const highlighted_text = highlightedString(annotationState.text, annotationState.first_name, annotationState.last_name)
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

  const checkArchetypeColor = (title) => {
    if (annotationState.archetype === title){
      if (relatedIdx !== '0'){
        return '#DDDDDD'
      } else{
        return '#1890ff'
      }
    } 

    return ""
  }

  const submitAnnotation = () => {
    updateAnnotation(annotationState)
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
        getAnnotations(userContext.userDoc.annotator_id, annotationsArray, setAnnotationArray)
      }
    }
  }, [annotationIdx]);

  const dropdownContent = (relatedAnnotations) => (
    <Menu defaultSelectedKeys={['0']} selectedKeys={[relatedIdx]}>
      {relatedAnnotations.map((item, index) => {
        const key = index;
        return <Menu.Item key={key} onClick={(e) => {setRelatedIdx(e.key); setAnnotationState(relatedAnnotations[e.key])}}>{item.annotator_id}</Menu.Item>;
      })}
    </Menu>
  )

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
        {Object.keys(annotationState).length === 1 && (
          <Result
            status="success"
            title="Congratulations!"
            subTitle="You've annotated all the data assigned to you"
            extra={[
              <Button 
                type="secondary" 
                key={"previous"}
                onClick={() => previousAnnotation()}
                disabled={annotationIdx == 0 ? true : false}>
                Previous
              </Button>
            ]}
          />
        )}
        {Object.keys(annotationState).length > 1 && (
          <div className="site-layout-content">
            <Row>
              <Col span={16} style={{paddingRight: "20px", textAlign:"justify"}}>
                <h1>INFO259 Character Annotation</h1>
                <Text id="descriptionText"/>
              </Col>
              <Col span={8} style={{textAlign:"center"}}>
                <Row style={{height: "33px", marginBottom:"8px"}} justify={relatedAnnotations.length > 0 ? "space-between" : "end"} align="middle">
                  {relatedAnnotations.length > 0 && (
                    <Dropdown overlay={dropdownContent(relatedAnnotations)}>
                      <Button size="small">
                        Annotation <DownOutlined />
                      </Button>
                    </Dropdown>
                  )}
                  <Space>
                    <Text style={{color:"lightgrey"}}>Explain archetypes:</Text>
                    <Switch style={{marginBottom:"2px"}} size="small" defaultChecked onChange={() => setShowDetails(!showDetails)}/>
                  </Space>
                </Row>
                <Space style={{paddingBottom:"10px"}}>
                  <Input 
                    id="first_name" 
                    value={annotationState.first_name} 
                    placeholder={"First Name"} 
                    disabled={relatedIdx === '0' ? false : true}
                    onChange={(e) => setAnnotationState({... annotationState, first_name: e.target.value, submitted: false})}
                  />
                  <Input 
                    id="last_name" 
                    value={annotationState.last_name} 
                    placeholder={"Last Name"} 
                    disabled={relatedIdx === '0' ? false : true}
                    onChange={(e) => setAnnotationState({... annotationState, last_name: e.target.value, submitted: false})}
                  />
                </Space>
                <Radio.Group value={annotationState.gender} buttonStyle="solid"  disabled={relatedIdx === '0' ? false : true} style={{paddingBottom:"10px"}} onChange={(e) => setAnnotationState({... annotationState, gender: e.target.value, submitted: false})}>
                  <Radio.Button value="male">Male</Radio.Button>
                  <Radio.Button value="other">Other</Radio.Button>
                  <Radio.Button value="female">Female</Radio.Button>
                </Radio.Group>
                <List
                  grid={{ gutter: 5, column: 3 }}
                  dataSource={archetypes}
                  renderItem={item => (
                    <List.Item>
                      <Popover content={popoverContent(item)} placement="left" trigger={showDetails ? "hover" : "none"}>
                        <Card hoverable={relatedIdx === '0' ? true : false}
                          disabled={relatedIdx === '0' ? false : true}
                          id={item.title}
                          onClick={(e) => {if(relatedIdx === '0'){setAnnotationState({... annotationState, archetype: e.currentTarget.id, submitted: false})}}}
                          style={{
                            width:"100%", 
                            height:"70px", 
                            marginBottom:"-10px", 
                            textAlign:"center",
                            backgroundColor: checkArchetypeColor(item.title),
                            color: annotationState.archetype == item.title ? 'white' : ''}}
                          bodyStyle={{
                            paddingLeft: "0", 
                            paddingRight: "0", 
                          }}>
                            {item.title}
                        </Card>
                      </Popover>
                    </List.Item>
                  )}
                />
                <Card hoverable={relatedIdx === '0' ? true : false}
                  id={'None'}
                  disabled={relatedIdx === '0' ? false : true}
                  onClick={(e) => {if(relatedIdx === '0'){setAnnotationState({... annotationState, archetype: 'None', submitted: false})}}}
                  style={{
                    width:"100%", 
                    height:"35px", 
                    textAlign:"center", 
                    backgroundColor: checkArchetypeColor('None'),
                    color: annotationState.archetype == 'None' ? 'white' : ''
                  }}
                  bodyStyle={{paddingLeft: "0", paddingRight: "0", paddingTop:"6px"}}>
                    None
                </Card>
                {relatedIdx === '0' && (
                  <Row justify="space-between" style={{paddingTop:"30px", paddingBottom:"10px"}}>
                    <Button 
                      type="secondary" 
                      onClick={() => previousAnnotation()}
                      disabled={annotationIdx == 0 ? true : false}>
                      Previous
                    </Button>
                    {(annotationState.submitted || userContext.userDoc.name.localeCompare("Guest") === 0) && (
                      <Button 
                        type="secondary" 
                        onClick={() => nextAnnotation()}>
                        Next
                      </Button>
                    )}
                    {(!annotationState.submitted && userContext.userDoc.name.localeCompare("Guest") !== 0 ) && (
                      <Button 
                        type="primary" 
                        onClick={() => submitAnnotation(annotationState)}
                        disabled={checkAnnotation()}>
                        Submit
                      </Button>
                    )}
                  </Row>
                )}
              </Col>
            </Row>
          </div>
        )}
      </Content>
    </Layout>
  );
}
