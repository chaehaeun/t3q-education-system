/* 허리케인 위성 사진 풍속 예측 - 위성 회귀 */
import axiosInstance from '@/services/axiosInstance'
import base64DataToFile from '../../base64DataToFile'

const satelliteRegression = async (
  value: any, // 사용자가 입력한 값 (string or base64)
  formUrl: any, // 사용자가 입력한 api Url
  setLoading: any, // 로딩
  // setResult: any, // 결과 컴포넌트
) => {
  const axiosUrl = '/api/inference/file_req_ajx' // 고정값
  const convertData = await base64DataToFile(value, 'image', 'image/jpeg')
  /* FormData (apiUrl, data) 형태로 전송 */
  const formData = new FormData()
  formData.append('url', formUrl)
  formData.append('file', convertData) // 사용자가 전송할 값이 [문자열] 형태일 때
  let resultData = ''

  setLoading(true) // 로딩 표시

  /* axios 비동기 통신 함수 */
  try {
    const res = await axiosInstance.post(axiosUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'json', //서버로부터 들어오는 응답값은 JSON 형식
    })
    let json = res.data
    if (json.res == 'true') {
      let response_data = json.response.data
      if (response_data == null) {
        response_data = json.response.inference
      }
      /* 결과값에 따라 결과 컴포넌트 렌더링 */
      resultData = '' + response_data[0]
    }
  } catch (err) {
    alert('API 호출에 실패했습니다.')
    return
  } finally {
    setLoading(false)
  }
  return resultData
}

export default satelliteRegression
