import { View } from 'react-native'
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated'
import { useRouter } from 'expo-router'
import type { UserInventory } from '@/types/inventory'
import { CardThumbnail } from './CardThumbnail'

interface Props {
  cards: UserInventory[]
}

export function MyCardsGrid({ cards }: Props) {
  const router = useRouter()
  const prefersReduced = useReducedMotion()

  return (
    <View className="flex-row flex-wrap p-2">
      {cards.map((card, i) => {
        const BaseView = prefersReduced ? View : Animated.View
        const animationProps = prefersReduced 
          ? {} 
          : { entering: FadeInDown.delay(Math.min(i, 5) * 80).duration(400) }

        return (
          <BaseView key={card.inventoryId} {...animationProps} className="w-1/2">
            <CardThumbnail 
              card={card} 
              onPress={() => {
                router.push({
                  pathname: '/(modals)/card-detail',
                  params: { templateId: card.cardTemplate.templateId }
                })
              }} 
            />
          </BaseView>
        )
      })}
    </View>
  )
}
