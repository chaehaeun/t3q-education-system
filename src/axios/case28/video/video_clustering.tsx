/* 얼굴 키포인트가 있는 데이터 군집화 - 영상 군집화 */
import axiosInstance from '@/services/axiosInstance'
import base64DataToFile from '../../base64DataToFile'

const videoClustering = async (
  value: any, // 사용자가 입력한 값 (string or base64)
  formUrl: any, // 사용자가 입력한 api Url
  setLoading: any, // 로딩
  // setResult: any, // 결과 컴포넌트
) => {
  const axiosUrl = '/api/inference/file_req_ajx' // 고정값
  const convertData = await base64DataToFile(value, 'gifImage', 'image/gif')
  /* FormData (apiUrl, data) 형태로 전송 */
  const formData = new FormData()
  formData.append('url', formUrl)
  formData.append('file', convertData)
  let resultData = ''
  let extraData = ''

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
      let response_image = json.response.all_cluster_image
      let response_data = json.response.inference_cluster
      resultData = 'data:image/jpeg;base64,' + response_image // $('#resImgSrc').attr('src', 'data:image/jpg;base64,' + response_image)
      const counts = response_data.reduce((pv: any, cv: any) => {
        pv[cv] = (pv[cv] || 0) + 1
        return pv
      }, {})
      const keys = Object.keys(counts)
      let mode = keys[0]
      keys.forEach((val: any) => {
        if (counts[val] > counts[mode]) {
          mode = val
        }
      })
      extraData = mode
      resultData = `${resultData} and ${extraData}`
    }
  } catch (err) {
    alert('API 호출에 실패했습니다.')
    return
  } finally {
    setLoading(false)
  }
  return resultData
}

export default videoClustering
