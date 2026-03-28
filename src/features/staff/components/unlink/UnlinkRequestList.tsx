import React, { useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import { colors, fonts } from '@/theme/index'
import { useUnlinkRequests } from '../../hooks/useUnlinkRequests'
import { useApproveUnlink } from '../../hooks/useApproveUnlink'
import { useRejectUnlink } from '../../hooks/useRejectUnlink'
import { UnlinkRequest } from '@/types/unlink'
import { ConfirmModal } from '@/components/common/ConfirmModal'
import { RejectSheet } from './RejectSheet'
import { useUserRole } from '@/hooks/useUserRole'
import { Redirect } from 'expo-router'

export function UnlinkRequestList() {
  const { isStaff, loading } = useUserRole()
  const { data: requests, isFetching } = useUnlinkRequests()
  const approveUnlink = useApproveUnlink()
  const rejectUnlink = useRejectUnlink()

  const [confirmApproveId, setConfirmApproveId] = useState<number | null>(null)
  const [rejectId, setRejectId] = useState<number | null>(null)

  if (loading) return null
  if (!isStaff) return <Redirect href="/(tabs)" />

  const targetApproveRequest = requests?.find(r => r.requestId === confirmApproveId)

  const handleApprove = () => {
    if (confirmApproveId) {
      approveUnlink.mutate(confirmApproveId, {
        onSettled: () => setConfirmApproveId(null)
      })
    }
  }

  const handleReject = (note: string) => {
    if (rejectId) {
      rejectUnlink.mutate({ requestId: rejectId, staffNote: note }, {
        onSettled: () => setRejectId(null)
      })
    }
  }

  const renderItem = ({ item }: { item: UnlinkRequest }) => {
    const isPending = item.status === 'PENDING'
    const statusColor = item.status === 'APPROVED' ? colors.success : item.status === 'REJECTED' ? colors.error : '#D98226'
    
    return (
      <View style={{ backgroundColor: colors.surface, padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: colors.border }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: 18, color: colors.text }}>
            Thẻ: {item.card.template.name}
          </Text>
          <Text style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, backgroundColor: `${statusColor}22`, color: statusColor, fontFamily: fonts.bodyMedium, fontSize: 12, overflow: 'hidden' }}>
            {item.status}
          </Text>
        </View>
        <Text style={{ fontFamily: fonts.bodyMedium, color: colors.textMuted, fontSize: 14 }}>
          UID: {item.card.nfcUid}
        </Text>
        <Text style={{ fontFamily: fonts.bodyMedium, color: colors.textMuted, fontSize: 14, marginBottom: 12 }}>
          Người yêu cầu: {item.customer.name} (Ngày: {new Date(item.requestedAt).toLocaleDateString()})
        </Text>
        {item.staffNote && (
          <Text style={{ fontFamily: fonts.bodyMedium, color: colors.secondary, fontSize: 14, marginBottom: 12, fontStyle: 'italic' }}>
            Ghi chú: {item.staffNote}
          </Text>
        )}

        {isPending && (
           <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
             <TouchableOpacity 
               style={{ flex: 1, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: colors.error }}
               onPress={() => setRejectId(item.requestId)}
             >
               <Text style={{ color: colors.error, fontFamily: fonts.bodyMedium, textAlign: 'center' }}>Từ chối</Text>
             </TouchableOpacity>
             <TouchableOpacity 
               style={{ flex: 1, padding: 10, borderRadius: 8, backgroundColor: colors.primary }}
               onPress={() => setConfirmApproveId(item.requestId)}
             >
               <Text style={{ color: colors.background, fontFamily: fonts.bodyMedium, textAlign: 'center' }}>Phê duyệt</Text>
             </TouchableOpacity>
           </View>
        )}
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 16 }}>
       <Text style={{ fontFamily: fonts.heading, fontSize: 28, color: colors.text, marginBottom: 20 }}>
          Yêu cầu hủy liên kết
       </Text>
       
       {isFetching && !requests ? (
         <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
       ) : (
         <FlatList
           data={requests ?? []}
           keyExtractor={(r: UnlinkRequest) => r.requestId.toString()}
           renderItem={renderItem}
           contentContainerStyle={{ paddingBottom: 40 }}
           ListEmptyComponent={<Text style={{ color: colors.textMuted, fontFamily: fonts.bodyMedium, textAlign: 'center', marginTop: 32 }}>Chưa có yêu cầu nào.</Text>}
         />
       )}

       <ConfirmModal
         visible={!!confirmApproveId && !!targetApproveRequest}
         title="Xác nhận phê duyệt"
         body={`Bạn có chắc chắn muốn phê duyệt lệnh hủy liên kết cho thẻ ${targetApproveRequest?.card.template.name} của khách hàng ${targetApproveRequest?.customer.name}?`}
         onCancel={() => setConfirmApproveId(null)}
         onConfirm={handleApprove}
         loading={approveUnlink.isPending}
       />

       <RejectSheet
         visible={!!rejectId}
         onClose={() => setRejectId(null)}
         onConfirm={handleReject}
         isLoading={rejectUnlink.isPending}
       />
    </View>
  )
}
