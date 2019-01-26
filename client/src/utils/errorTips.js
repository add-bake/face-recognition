const errorTipsSimple = {
  '4': '集群超限额',
  '6': '没有接口权限',
  '17': '每天流量超限额',
  '18': 'QPS超限额',
  '19': '请求总量超限额',
  '100': '无效的access_token参数',
  '111': 'Access token过期',
  '222001': '必要参数未传入',
  '222027': '验证码长度错误(最小值大于最大值)',
  '222200': '该接口需使用application/json的格式进行请求',
  '222202': '图片中没有人脸',
  '222203': '无法解析人脸',
  '222204': '从图片的url下载图片失败',
  '222207': '未找到匹配的用户',
  '222208': '图片的数量错误',
  '222209': 'face token不存在',
  '222210': '人脸库中用户下的人脸数目超过限制',
  '222300': '人脸图片添加失败',
  '223100': '操作的用户组不存在',
  '223101': '该用户组已存在',
  '223102': '该用户已存在',
  '223103': '找不到该用户',
  '223104': 'group_list包含组数量过多',
  '223105': '该人脸已存在',
  '223106': '该人脸不存在',
  '223110': 'uid_list包含数量过多',
  '223111': '目标用户组不存在',
  '223112': 'quality_conf格式不正确',
  '223113': '人脸有被遮挡',
  '223114': '人脸模糊',
  '223115': '人脸光照不好',
  '223116': '人脸不完整',
  '223117': 'app_list包含app数量过多',
  '223118': '质量控制项错误',
  '223119': '活体控制项错误',
  '223120': '活体检测未通过',
  '223121': '质量检测未通过 左眼遮挡程度过高',
  '223122': '质量检测未通过 右眼遮挡程度过高',
  '223123': '质量检测未通过 左脸遮挡程度过高',
  '223124': '质量检测未通过 右脸遮挡程度过高',
  '223125': '质量检测未通过 下巴遮挡程度过高',
  '223126': '质量检测未通过 鼻子遮挡程度过高',
  '223127': '质量检测未通过 嘴巴遮挡程度过高',
  '222304': '图片尺寸太大',
  '223128': '正在清理该用户组的数据',
  '222361': '公安服务连接失败'
}

const errorTipsComplex = {
  '222201|222205|222206|222302': '服务端请求失败',
  '222301|222303': '获取人脸图片失败',
  '222901|222902|222903|222904|': '参数校验初始化失败',
  '222905|222906|222913|222914': '接口初始化失败',
  '222907|222908|222909': '缓存处理失败',
  '222910|222911|222912': '数据存储处理失败',
  '222915|222916': '后端服务连接失败',
  '222002|222003|222004|222005|222006|222007|222008|222009|222010|222011|222012|222013|222014|222015|222016|222017|222018|222019|222020|222021|222022|222023|222024|222025|222026': '参数格式错误'
}

function getComplexError (code) {
  let result = Object.entries(errorTipsComplex).filter(x => x[0].indexOf(code) >= 0)
  return result.length ? result[0][1] : '人脸识别未知错误'
}

export default code => {
  code = typeof code === 'number' ? code.toString() : code
  return errorTipsSimple[code] || getComplexError(code)
}