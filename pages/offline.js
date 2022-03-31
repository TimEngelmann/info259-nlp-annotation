import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import { Button, Row, Col, Input, Space, Radio, Card, List, Layout, Spin, Typography, Result, Popover, Switch, Dropdown, Menu, Progress, Upload, message } from "antd";
import { DownOutlined, UserOutlined, DragOutlined, IssuesCloseOutlined, IdcardOutlined, QuestionCircleOutlined, InboxOutlined } from '@ant-design/icons';

import Link from "next/link";
import { AuthUserContext } from "../utils/auth";
import { getAnnotations, getRelatedAnnotations, updateAnnotation, saveAnnotations } from "../utils/localdata";

import { archetypes, labels } from "../components/constants";

const { Header, Content } = Layout;
const { Text, Title } = Typography;
const { Dragger } = Upload;

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

const popoverContentLabel = (item) => (
  <div style={{maxWidth: "300px"}}>
    <Title level={5}>{item.title}</Title>
    <Text>{item.details}</Text>
  </div>
);

export default function Home() {
  const userContext = useContext(AuthUserContext);
  const [annotationIdx, setAnnotationIdx] = useState(0)
  const [sessionGoal, setSessionGoal] = useState(50)
  const [showDetails, setShowDetails] = useState(0)
  const [batch, setBatch] = useState("exploration")
  const [annotationsArray, setAnnotationArray] = useState([])
  const [annotationState, setAnnotationState] = useState({})
  const [relatedAnnotations, setRelatedAnnotations] = useState([])
  const [relatedIdx, setRelatedIdx] = useState('0')

  useEffect(() =>{
    if (annotationsArray.length > annotationIdx){
      setAnnotationState(annotationsArray[annotationIdx])
    } else{
      if(annotationIdx > 0){
        // getAnnotations(userContext.userDoc.annotator_id, annotationsArray, batch, setAnnotationArray)
        const annotation_empty = {"dummy": "finished"}
        annotationsArray.push(annotation_empty)
      }
    }
  }, [annotationIdx, annotationsArray, batch, userContext.userDoc.annotator_id]);

  useEffect(() => {
    if(Object.keys(annotationState).length > 1){
      if(annotationState.adjudicated === "adjudicated" && annotationState.batch === batch){
        if(relatedAnnotations.length === 0 || relatedAnnotations[0].book_id !== annotationState.book_id){
          getRelatedAnnotations(annotationState, setRelatedAnnotations)
        }
      }

      const highlighted_text = highlightedString(annotationState.text, annotationState.first_name, annotationState.last_name)
      const decriptionText = document.getElementById("descriptionText");
      decriptionText.innerHTML = highlighted_text;
    }
  }, [annotationState, relatedAnnotations, batch]);

  const checkAnnotation = () => {
    if (annotationState.gender == "" || annotationState.archetype == ""){
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

    return 'white'
  }

  const submitAnnotation = () => {
    
    updateAnnotation(annotationState, userContext.user)

    // match label to archetype
    const archetype = archetypes.find(archetype => archetype.title === annotationState.archetype);
    var label = 'NONE'
    if (typeof archetype !== 'undefined'){
      label = archetype.label
    }
    annotationState.label = label

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

  const switchAnnotation = (e) => {
    relatedAnnotations[relatedIdx] = annotationState
    setRelatedIdx(e.key)
    setAnnotationState(relatedAnnotations[e.key])
  }

  const dropdownContent = (relatedAnnotations) => (
    <Menu defaultSelectedKeys={['0']} selectedKeys={[relatedIdx]}>
      {relatedAnnotations.map((item, index) => {
        const key = index;
        return <Menu.Item key={key} onClick={(e) => switchAnnotation(e)}>{item.annotator_id}</Menu.Item>;
      })}
    </Menu>
  )
  
  const helpContent = () => (
    <div>
      <Title level={5}>Show description of:</Title>
      <Radio.Group onChange={(e) => setShowDetails(e.target.value)} value={showDetails}>
        <Space direction="vertical">
          <Radio value={1}><DragOutlined/> Labels</Radio>
          <Radio value={2}><IdcardOutlined/> Archetypes</Radio>
          <Radio value={0}><IssuesCloseOutlined/> Nothing</Radio>
        </Space>
      </Radio.Group>
    </div>
  )

  const renderArchetypes = (label) => (
    <Popover content={popoverContentLabel(label)} placement="left" trigger={showDetails === 1 ? "hover" : "none"}>
      <Card title={<div><Text>{label.title}</Text><Text style={{fontWeight: "normal", fontSize: 14, color:"lightgrey"}}>{' - ' + label.description}</Text></div>} size="small" 
        style={{textAlign: 'left', backgroundColor: "#FBFBFB"}} 
        bodyStyle={{padding: 0, margin: 0}}
      >
        {archetypes.map((item, index) => {
          if(item.label === label.title){
            return (
              <Popover key={index} content={popoverContent(item)} placement="left" trigger={showDetails === 2 ? "hover" : "none"}>
                <Card.Grid hoverable={relatedIdx === '0' ? true : false}
                  key={index}
                  disabled={relatedIdx === '0' ? false : true}
                  id={item.title}
                  onClick={(e) => {if(relatedIdx === '0'){setAnnotationState({... annotationState, archetype: e.currentTarget.id, submitted: false})}}}
                  style={{
                    width:"33.33%", 
                    height:"30px",
                    margin: "auto",
                    padding: 5, 
                    textAlign:"center",
                    backgroundColor: checkArchetypeColor(item.title),
                    color: annotationState.archetype == item.title ? 'white' : ''}}
                  bodystyle={{
                    paddingLeft: "0", 
                    paddingRight: "0", 
                  }}>
                    {item.title}
                </Card.Grid>
              </Popover>
            )
          }
        })}
      </Card>
    </Popover>
  )

  const uploadProps = {
    accept: ".txt, .csv",
    name: 'file',
    multiple: false,
    beforeUpload(file){
      const reader = new FileReader();

      reader.onload = e => {
        getAnnotations(e.target.result, setAnnotationArray, setAnnotationIdx)
      };
      reader.readAsText(file);

      // Prevent upload
      return false;
    },
  };

  return (
    <Layout className="layout">
      <Head>
        <title>INFO259</title>
        <meta name="description" content="Annotation Project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header>
        <div className="logo" />
        <Row justify="space-between" align="middle">
          {!userContext.user && (
            <Link href="/login" passHref>
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
          <Link href="/" passHref>
            <Button style={{color:"lightgrey", cursor:"pointer", backgroundColor: "transparent", border: "None"}}>offline</Button>
          </Link>
        </Row>
      </Header>
      <Content style={{ padding: '0 50px', minHeight: 'calc(100vh - 65px)', margin:"auto"}}>
        {Object.keys(annotationState).length === 0 && (
          <Dragger {...uploadProps} style={{marginTop: "50px", padding: 30}}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
              CSV must include following header:
            </p>
            <p className="ant-upload-hint" style={{fontSize:9}}>
              book_id,text,first_name,last_name,gender,batch,archetype,label,adjudicated,annotator_id
            </p>
          </Dragger>
        )}
        {Object.keys(annotationState).length === 1 && (
          <Result
            status="success"
            title="Congratulations!"
            subTitle="You've annotated all the data in this batch"
            extra={
              <Space direction="vertical">
                <Button 
                  type="secondary" 
                  key={"previous"}
                  onClick={() => previousAnnotation()}
                  disabled={annotationIdx == 0 ? true : false}>
                  Previous
                </Button>
              </Space>
            }
          />
        )}
        {Object.keys(annotationState).length > 1 && (
          <div style={{padding: "24px", maxWidth: "1200px", background:'white', marginTop: "10px"}}>
            <Row>
              <Col flex="60px"><Text style={{color:"lightgrey"}}>Overall</Text></Col>
              <Col flex="15px" style={{textAlign: 'right'}}><Text style={{color:"lightgrey"}}>{annotationIdx}</Text></Col>
              <Col flex="15px" style={{textAlign: 'center'}}><Text style={{color:"lightgrey"}}>/</Text></Col>
              <Col flex="40px"><Text style={{color:"lightgrey"}}>{annotationsArray.length}</Text></Col>
              <Col flex="auto"><Progress className="grey-text" percent={(((annotationIdx)/ annotationsArray.length) * 100).toPrecision(2)} /></Col>
            </Row>
            <Row>
              <Col flex="60px"><Text style={{color:"lightgrey"}}>Session</Text></Col>
              <Col flex="15px" style={{textAlign: 'right'}}><Text style={{color:"lightgrey"}}>{annotationIdx}</Text></Col>
              <Col flex="15px" style={{textAlign: 'center'}}><Text style={{color:"lightgrey"}}>/</Text></Col>
              <Col flex="40px"><Input style={{padding: 0, margin: 0, color: "lightgrey", width: "30px", textAlign: "center"}} value={sessionGoal} onChange={(e) => setSessionGoal(e.target.value)}/></Col>
              <Col flex="auto"><Progress className="grey-text" percent={(((annotationIdx)/sessionGoal) * 100).toPrecision(2)} /></Col>
            </Row>
          </div>
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
                    <Popover content={helpContent} trigger="click" placement="left">
                      <QuestionCircleOutlined style={{color: "lightgrey"}}/>
                    </Popover>
                  </Space>
                </Row>
                <Space style={{paddingBottom:"10px"}}>
                  <Input 
                    id="first_name" 
                    value={annotationState.first_name} 
                    placeholder={"First Name"} 
                    disabled={relatedIdx === '0' ? true : true}
                    onChange={(e) => setAnnotationState({... annotationState, first_name: e.target.value, submitted: false})}
                  />
                  <Input 
                    id="last_name" 
                    value={annotationState.last_name} 
                    placeholder={"Last Name"} 
                    disabled={relatedIdx === '0' ? true : true}
                    onChange={(e) => setAnnotationState({... annotationState, last_name: e.target.value, submitted: false})}
                  />
                </Space>
                <Radio.Group value={annotationState.gender} buttonStyle="solid"  disabled={relatedIdx === '0' ? false : true} style={{paddingBottom:"10px"}} onChange={(e) => setAnnotationState({... annotationState, gender: e.target.value, submitted: false})}>
                  <Radio.Button value="male">Male</Radio.Button>
                  <Radio.Button value="other">Other</Radio.Button>
                  <Radio.Button value="female">Female</Radio.Button>
                </Radio.Group>
                <List
                  grid={{ gutter: 5, column: 1 }}
                  dataSource={labels}
                  style={{backgroundColor: 'transparent'}}
                  renderItem={label => (
                    <List.Item>
                      {renderArchetypes(label)}
                    </List.Item>
                  )}
                />
                <Card hoverable={relatedIdx === '0' ? true : false}
                  id={'None'}
                  disabled={relatedIdx === '0' ? false : true}
                  onClick={(e) => {if(relatedIdx === '0'){setAnnotationState({... annotationState, archetype: 'None', label: 'NONE', submitted: false})}}}
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
                    <Button 
                      type="secondary" 
                      onClick={() => saveAnnotations(annotationsArray)}
                      disabled={annotationIdx == 0 ? true : false}>
                      Save CSV
                    </Button>
                    {(annotationState.submitted) && (
                      <Button 
                        type="secondary" 
                        onClick={() => nextAnnotation()}>
                        Next
                      </Button>
                    )}
                    {(!annotationState.submitted) && (
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
