import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper'
import { Title, DropdownMenu } from '@/components'
import { useEffect, useRef } from 'react'
import styles from './DetailCarousel.module.css'
import '@/detailSwiper.css'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/swiper.min.css'
import json from '@/data/PPT_DATA.json'
import { cartAtom } from '@/atoms/index'
import { useRecoilState } from 'recoil'
import useBook from '@/hooks/useBook'
import Cookies from 'js-cookie'

interface DetailCarouselProps {
  className: string
  pageId: string | undefined
}

const DetailCarousel = ({ className, pageId }: DetailCarouselProps) => {
  const target = json.find(item => String(item.id) === pageId)
  const fileList = target?.category || []
  const folderName = target?.folderName
  const pageTitle = target?.title //상세페이지 제목이 담긴다
  const swiperRef = useRef<SwiperRef>(null)
  const userAuth = Cookies.get('user_auth')

  // 이미지 로드 실패시 기본 이미지를 로드하는 함수
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    e.currentTarget.src = '/src/assets/default.jpg' // 임의의 이미지 경로
  }

  //찜을 확인하는 기능
  const { checkBook } = useBook()

  //cart에는 장바구니 기능을 위한 페이지 id와 title이 저장된다
  const [cart, setCart] = useRecoilState(cartAtom)

  useEffect(() => {
    // 컴포넌트가 렌더링된 다음 cart의 값으로 id, title 키를 가진 객체가 저장된다
    setCart({ id: Number(pageId), title: pageTitle })
  }, [pageId, pageTitle])

  useEffect(() => {
    // 상세페이지가 장바구니에 들어가있는 지를 확인한다
    // cart Atom을 추적하고 있어, cart Atom이 업데이트된 다음에 실행될 수 있게끔 했다.
    if (userAuth) {
      checkBook()
    }
  }, [cart, Cookies.get('user_auth')])

  const imagePaths = Array.from(
    { length: fileList.length },
    (_, index) => `/src/assets/pptImage/${folderName}/slide${index + 1}.jpeg`,
  )

  const gotoSlide = (selectedIndex: number) => {
    swiperRef.current?.swiper?.slideTo(selectedIndex)
  }

  useEffect(() => {
    // imagePaths 또는 target 변경시 swiper를 첫 번째 슬라이드로 초기화
    swiperRef.current?.swiper?.slideTo(0)
  }, [target])

  return (
    <section className={styles.container}>
      <Title
        className={styles['detail-title']}
        type={2}
        label={target?.title || 'default'}
      />
      <div className={styles.detailInfo}>
        <DropdownMenu
          options={fileList}
          targetIndex={index => gotoSlide(index)}
          className={styles.detailFilter}
        />
      </div>
      <Swiper
        ref={swiperRef}
        className={`${className} ${styles['my-swiper']}`}
        navigation={true}
        centeredSlides={true}
        modules={[Navigation]}
      >
        {imagePaths.map((path, index) => (
          <SwiperSlide key={index}>
            <img
              src={path}
              alt={`Slide ${index + 1}`}
              onError={handleImageError} // 이미지 로드 실패시 기본 이미지 호출
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

export default DetailCarousel
