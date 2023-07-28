import {
  Title,
  ApiURL,
  Input,
  Result,
  Button,
  DropdownMenu,
} from '@/components'
import styles from './DetailForm.module.css'
import { useCallback, useEffect, useState } from 'react'
import {
  detailDataAtom,
  inputValidationAtom,
  loadingAtom,
  // resultAtom,
} from '@/atoms/index'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { DataType } from '@/pages/Detail/Detail'
import { default as combinedFunction } from '@/axios/combinedAxios'
import addMimeType from '@/utils/addMimeType'

export type InferObj = {
  label: string
}
type SelectedFileType = Record<string, string> | null | undefined
interface DetailFormProps {
  data: DataType | null
  pageId: string | undefined
}

const DetailForm = ({ data, pageId }: DetailFormProps) => {
  const setLoading = useSetRecoilState(loadingAtom)
  // const setResult = useSetRecoilState(resultAtom)
  const [selected, setSelected] = useState('default')
  const [selectedFile, setSelectedFile] = useState<SelectedFileType>(null)
  const [value, setValue] = useRecoilState(detailDataAtom)
  const [isValid] = useRecoilState(inputValidationAtom)
  const [infer, setInfer] = useState<string | InferObj | null>(null)
  const [apiURL, setApiURL] = useState<string>('')

  const fileList = data &&
    data['data_list'] && [
      '예제 선택하기',
      ...data['data_list'].map(item => item.name),
    ] // 파일 리스트 배열 생성

  const onChange = useCallback(
    (selected: string) => {
      setSelected(selected) // 선택한 파일 이름 저장
    },
    [selected],
  )

  useEffect(() => {
    if (selected === 'default') {
      setSelectedFile(null)
    } else {
      const target =
        data && data['data_list'].find(item => item.name === selected)
      if (pageId && target) {
        const mapping = { ...target, data: addMimeType(pageId, target.data) }
        setSelectedFile(mapping)
      }
    }
  }, [selected, data])

  const onClick = useCallback(async () => {
    if (value) {
      const inferResult = await combinedFunction(
        pageId,
        value,
        apiURL,
        setLoading,
      )
      setInfer(inferResult === undefined ? null : inferResult)
    } else if (!isValid.isValid) {
      alert(isValid.message)
    }
  }, [value])

  const getInputData = useCallback((data: any) => {
    setValue(data)
  }, [])

  return (
    <section className={styles.container}>
      <Title
        type={2}
        label={'예제 실행해보기'}
        className={'detailform-title'}
      />
      <ApiURL api={data && data.API} apiURL={apiURL} setApiURL={setApiURL} />
      <div className={styles['input-cont']}>
        {data ? (
          <Input
            selected={selectedFile}
            getData={getInputData}
            type={data['data_type']}
          />
        ) : (
          <div className={styles.loading}>로딩 중...</div>
        )}

        <Result infer={{ label: '정상 블록' }} />
      </div>
      {fileList && <DropdownMenu options={fileList} onSelect={onChange} />}
      <Button
        option={1}
        label={'추론하기'}
        onClick={onClick}
        className={styles['button--input']}
      />
    </section>
  )
}

export default DetailForm
