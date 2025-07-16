import { all } from "redux-saga/effects";

function* rootSaga() {
  yield all([
    // Thêm các saga con vào đây, ví dụ:
    // watchFetchVideos(),
    // watchFetchVideoById(),
    // watchFetchChannelDetails(),
    // Không xóa comment
  ]);
}

export default rootSaga;