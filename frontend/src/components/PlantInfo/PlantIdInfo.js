import React from 'react';
import { Card, Typography, List, Divider, Tag, Space, Progress } from 'antd';
import { CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const PlantIdInfo = ({ data }) => {
  console.log('PlantIdInfo received data:', data);
  
  if (!data) {
    console.log('No data provided to PlantIdInfo');
    return null;
  }

  const {
    name,
    scientificName,
    confidence,
    description,
    taxonomy,
    structuredName,
    commonNames,
    synonyms,
    gbifId,
    inaturalistId,
    imageUrl,
    careInfo,
    edibleParts,
    wikiUrl,
    similarImages,
    healthAssessment
  } = data;

  const renderHealthStatus = () => {
    if (!healthAssessment) return null;

    return (
      <>
        <Divider orientation="left">Health Assessment</Divider>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ marginBottom: '1rem' }}>
            <Tag color={healthAssessment.isHealthy ? 'success' : 'error'} icon={healthAssessment.isHealthy ? <CheckCircleOutlined /> : <WarningOutlined />}>
              {healthAssessment.isHealthy ? 'Plant is Healthy' : 'Health Issues Detected'}
            </Tag>
          </div>

          {healthAssessment.diseases && healthAssessment.diseases.length > 0 && (
            <div>
              <Title level={5}>Detected Issues:</Title>
              <List
                dataSource={healthAssessment.diseases}
                renderItem={disease => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <Space>
                          <span>{disease.name}</span>
                          <Progress type="circle" percent={Math.round(disease.probability * 100)} width={30} />
                        </Space>
                      }
                      description={
                        <div>
                          <Paragraph>{disease.description}</Paragraph>
                          {disease.treatment && (
                            <div>
                              <Text strong>Treatment Options:</Text>
                              <ul>
                                {disease.treatment.mechanical && <li>Mechanical: {disease.treatment.mechanical}</li>}
                                {disease.treatment.biological && <li>Biological: {disease.treatment.biological}</li>}
                                {disease.treatment.chemical && <li>Chemical: {disease.treatment.chemical}</li>}
                              </ul>
                            </div>
                          )}
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          )}

          {healthAssessment.suggestions && healthAssessment.suggestions.length > 0 && (
            <div>
              <Title level={5}>Recommendations:</Title>
              <List
                dataSource={healthAssessment.suggestions}
                renderItem={suggestion => (
                  <List.Item>
                    <Text>{suggestion}</Text>
                  </List.Item>
                )}
              />
            </div>
          )}
        </Space>
      </>
    );
  };

  return (
    <Card title="Plant.id Analysis" style={{ marginBottom: '1rem' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Title level={4}>{name || 'Unknown Plant'}</Title>
          {scientificName && (
            <Text type="secondary">{scientificName}</Text>
          )}
          {confidence && (
            <Progress percent={confidence} status="active" />
          )}
        </div>

        {description && (
          <>
            <Divider orientation="left">Description</Divider>
            <Paragraph>{description}</Paragraph>
          </>
        )}

        <Divider orientation="left">Plant Details</Divider>
        <Space wrap>
          {commonNames && commonNames.map((name, index) => (
            <Tag key={index} color="blue">{name}</Tag>
          ))}
        </Space>

        {careInfo && (
          <>
            <Divider orientation="left">Care Information</Divider>
            <List>
              {careInfo.watering && <List.Item><Text strong>Watering: </Text>{careInfo.watering}</List.Item>}
              {careInfo.growthRate && <List.Item><Text strong>Growth Rate: </Text>{careInfo.growthRate}</List.Item>}
              {careInfo.toxicity && <List.Item><Text strong>Toxicity: </Text>{careInfo.toxicity}</List.Item>}
              {careInfo.propagation && (
                <List.Item>
                  <Text strong>Propagation Methods: </Text>
                  <Space wrap>
                    {careInfo.propagation.map((method, index) => (
                      <Tag key={index} color="green">{method}</Tag>
                    ))}
                  </Space>
                </List.Item>
              )}
            </List>
          </>
        )}

        {edibleParts && edibleParts.length > 0 && (
          <>
            <Divider orientation="left">Edible Parts</Divider>
            <Space wrap>
              {edibleParts.map((part, index) => (
                <Tag key={index} color="orange">{part}</Tag>
              ))}
            </Space>
          </>
        )}

        {renderHealthStatus()}

        {similarImages && similarImages.length > 0 && (
          <>
            <Divider orientation="left">Similar Images</Divider>
            <Space wrap>
              {similarImages.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={`Similar plant ${index + 1}`}
                  style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '4px' }}
                />
              ))}
            </Space>
          </>
        )}

        {wikiUrl && (
          <div style={{ marginTop: '1rem' }}>
            <a href={wikiUrl} target="_blank" rel="noopener noreferrer">
              Learn more on Wikipedia
            </a>
          </div>
        )}
      </Space>
    </Card>
  );
};

export default PlantIdInfo;
