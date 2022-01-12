import { useSelector } from 'react-redux';
import { selectTopicTrendsNum } from '../../../../../../utils/slice/topicTrendsNumSlice'
import { selectTopicTrends } from '../../../../../../utils/slice/topicTrendsSlice'

export const useTopicTrends = ()=>{
    const topicTrendsNum = useSelector(selectTopicTrendsNum);
    const topicTrends = useSelector(selectTopicTrends);

    return {topicTrends,topicTrendsNum};
}