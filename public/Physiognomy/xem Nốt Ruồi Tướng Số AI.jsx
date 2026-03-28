import React, { useState, useEffect } from 'react';
import { Search, User, UserCheck, AlertCircle, Info, FlipHorizontal, Pointer, Settings, Copy, CheckCircle2, Smile, Frown, Meh, Sparkles, Plus, Trash2, Loader2 } from 'lucide-react';

// Dữ liệu mẫu trích xuất từ nhân tướng học cơ bản
const moleData = {
  male: {
    1: "Nếu là nốt ruồi son: Biểu hiện của sự cát tường. Đàn ông có nét tướng này rất độc lập, có khả năng đạt được những thành tựu to lớn trong cuộc sống. Nếu là nốt ruồi đen: Tràn đầy tự tin và có xu hướng đạt được những thành công vượt qua mức mong đợi. Tuy nhiên, không phù hợp để có thể hình thành mối quan hệ bạn bè với người khác hoặc thậm chí đánh đổi và lãng quên tình bạn vì công việc và lợi nhuận.",
    2: "Tính cách nóng nảy, hung bạo, dễ mất tự chủ, khó kiểm soát cảm xúc.",
    3: "Hại cha hoặc gây điều bất lợi cho cha.",
    4: "Tham vọng lớn, thích làm quan, ham công danh sự nghiệp.",
    5: "Thích làm việc công, lo chuyện bao đồng.",
    6: "Nốt ruồi mang lại đại phú đại quý quý nếu có sắc khí tốt.",
    7: "Nếu có màu đỏ son, đây là nốt ruồi đại cát.",
    8: "Số không có gia đình, phải bôn ba nơi đất khách và chết ở xứ người.",
    9: "Nếu là nốt ruồi son, tài vận hanh thông, làm kinh doanh buôn bán sẽ phát tài, giàu có.",
    10: "Không nên tham gia những hoạt động mạo hiểm như leo núi cao, thám hiểm…tránh xảy ra tai nạn nguy hiểm tới tính mạng.",
    11: "Đây là nốt ruồi dữ. Người này tính tình lầm lì, cổ quái, thích sống đơn độc và có xu hướng tự sát.",
    12: "Tài vận hanh thông, là tướng nốt ruồi đại phúc.",
    13: "Nếu là nốt ruồi son, đường quan lộc thuận buồm xuôi gió.",
    14: "Chi tiêu hoang phí, dễ tán tài tán lộc.",
    15: "Nếu là nốt ruồi son có thể làm quan to.",
    16: "Tâm địa độc ác, hung bạo và tàn nhẫn. Tuy nhiên, nếu thay đổi vận số sẽ tốt hơn.",
    17: "Nếu là nốt ruồi son và sắc khí tốt là tướng đại cát, gặp nhiều may mắn trong cuộc sống.",
    18: "Nếu nốt ruồi màu đỏ son là tướng giàu có.",
    19: "Người có tâm địa đen tối, hung ác, dễ khiến người khác phải xa lánh, dè chừng.",
    20: "Dễ gặp nhiều xui xẻo, tai nạn bất ngờ hoặc mắc bệnh nan y.",
    21: "Tính cách hung bạo, gặp nhiều xui xẻo.",
    22: "Nếu là nốt ruồi son thì quan vận sáng, dễ được thăng quan tiến chức.",
    23: "Tính tình hung ác, tàn bạo.",
    24: "Tướng nốt ruồi đại hung, dễ bị thất bại.",
    25: "Tính tình hung bạo, độc ác.",
    26: "Tính tình hung ác, ngang ngược, khó dạy bảo.",
    27: "Cản trở đối tác làm ăn là nam giới.",
    28: "Gây trở ngại cho cha.",
    29: "Gây trở ngại cho con gái.",
    30: "Gây trở ngại cho vợ.",
    31: "Đời sau hiếm muộn đường con cái, đặc biệt khó sinh con gái.",
    32: "Gây trở ngại cho con trai.",
    33: "Nốt ruồi mang lại nhiều may mắn và tài lộc.",
    34: "Tướng nốt ruồi phá tài, dễ gặp thất bại.",
    35: "Dễ bị chết đuối, cẩn trọng khi bơi lội hoặc đi lại bằng tàu thuyền trên sông nước.",
    36: "Ít tiền của, tài lộc kém sắc.",
    37: "Cuộc sống sung túc, được hưởng phúc lộc.",
    38: "Cuộc sống khá giả, không phải lo cơm áo gạo tiền.",
    39: "Ít ruộng đất, nhà cửa. Xảy ra sự cố lớn về tiền bạc như tranh chấp, mất mát…",
    40: "Suốt đời nghèo khó, thậm chí bị chết đói.",
    41: "Thường gây khó dễ cho cấp dưới.",
    42: "Nhiều lời, thích đâm bị thóc chọc bị gạo, xúi giục người khác gây chuyện thị phi.",
    43: "Khó có được các nguồn tài phụ hoặc thu nhập phụ.",
    44: "Tướng nốt ruồi cát lợi.",
    45: "Đầu óc thông minh, sáng suốt.",
    46: "Tướng nốt ruồi mang lại nhiều may mắn và tài lộc.",
    47: "Có được sự trợ giúp và nâng đỡ của người bề trên, tuy nhiên nếu màu sắc nốt ruồi không tốt sẽ mang ý nghĩa ngược lại. Ngoài ra, người này có tín ngưỡng tôn giáo sâu sắc, là người thông minh, chân thành, lương thiện.",
    48: "Số phạm đào hoa sát, dễ rơi vào cuộc tình tay ba, cuộc sống hôn nhân gia đình không hạnh phúc, khó lấy được vợ hiền, ngoài ra còn dễ mắc bệnh tật.",
    49: "Nhát gan, khả năng phán đoán vấn đề kém, thiếu cảm giác an toàn nên nảy sinh tâm lí lo lắng. Tình duyên trắc trở, nhiều lần lấy vợ hụt.",
    50: "Khả năng tư duy và phân tích kém nhưng lại tham vọng, làm việc theo kiểu chắp vá. Hôn nhân không hạnh phúc, xuất hiện người thứ ba cản trở tình cảm vợ chồng.",
    51: "Người này có chí tiến thủ, sự nghiệp thành đạt, tài vận hanh thông, tiền của dồi dào, có cơ hội phát tài bất ngờ. Ngoài ra, ham muốn tình dục mạnh, dễ vướng vào tửu sắc.",
    52: "Người này có chí tiến thủ, sự nghiệp thành đạt, tài vận hanh thông, tiền của dồi dào, có cơ hội phát tài bất ngờ. Ngoài ra, ham muốn tình dục mạnh, dễ vướng vào tửu sắc.",
    53: "Nếu là nốt ruồi lành, tài vận hanh thông, nhân duyên tốt. Ngược lại, nếu nốt ruồi hung, khó tụ tài, cẩn thận giai đoạn năm 44-45 tuổi hoặc 49-50 tuổi gặp phá tài nặng. Ngoài ra, nhân duyên với người khác giới không tốt, tình duyên trắc trở.",
    54: "Người này dễ bị kẻ tiểu nhân hãm hại hoặc cản trở về cả công danh sự nghiệp và tình duyên.",
    55: "Nếu là nốt ruồi son, khí sắc tốt sẽ mang lại nhiều tiền của, đất đai. Ngoài ra, người này rất biết cách hưởng thụ cuộc sống. Nhưng là nốt ruồi đen, công việc, cuộc sống có nhiều biến động lớn, phải bôn ba khắp nơi để cầu tài, khó sống cố định một nơi.",
    56: "Háo sắc, nhiều dục vọng.",
    57: "Người có học vấn uyên thâm, phúc lộc song toàn, được hưởng vinh hoa phú quý và tài sản do tổ tiên để lại. Tuy nhiên, sức khỏe không tốt, dễ mắc bệnh tật.",
    58: "Người này có tài ăn nói, có số làm lãnh đạo nhưng tâm hồn cô độc, dễ vướng vào họa khẩu thiệt thị phi, vô ý đắc tội người khác, nhân duyên kém và nhiều kẻ thù.",
    59: "Trên đường Pháp lệnh có nốt ruồi, trung vận phát tài, địa vị thăng tiến. Nếu là nốt ruồi ở gần cạnh hoặc dưới Pháp lệnh, dễ nhiễm thói hư cờ bạc, cá độ, cuộc sống bần hàn.",
    60: "Người thông minh, cẩn trọng, cư xử khéo léo và tự mình lập nghiệp. Chuyện tình cảm tuy gặp nhiều trở ngại nhưng cuộc sống sau hôn nhân khá hạnh phúc.",
    61: "Hôn nhân hạnh phúc về sau sau khi đã trải qua khá nhiều trắc trở. Thông minh, khéo léo, tự gây dựng sự nghiệp.",
    62: "Người có chí tiến thủ, công danh sự nghiệp thuận lợi, có chức vụ cao trong công việc, có số làm quản lí hoặc lãnh đạo. Tuy nhiên, đề phòng tai họa bất ngờ như ngã từ trên cao, bị dao kiếm chém…",
    63: "Có chí tiến thủ, sự nghiệp khá thuận lợi, có chức vụ cao, có quyền lực trong tay. Tuy nhiên, đề phòng tai nạn bất ngờ như bị dao kiếm đâm chém hoặc ngã từ trên cao xuống...",
    64: "Không thuận lợi trong việc kết giao bạn bè, dễ chịu thua thiệt. Ngoài ra, cần đề phòng hỏa hoạn, kiện tụng.",
    65: "Nếu là nốt ruồi lành, tài vận rất vượng. Nếu là nốt ruồi dữ, có tranh chấp về tài sản, xuất hiện phá tài.",
    66: "Người có tài năng nghệ thuật, học thức sâu rộng, sự nghiệp thành đạt. Vào trung vận, hôn nhân trục trặc, có thể dẫn tới li hôn. Ngoài ra, đề phòng chết đuối.",
    67: "Tính cách phong lưu đa tình, tình cảm không ổn định. Ngoài ra, cần đề phòng những việc tranh chấp kiện tụng dẫn đến ngồi tù.",
    68: "Lối sống phong lưu, tình cảm hay thay đổi, khó tụ tài, thậm chí phá tài, tiêu tốn nhiều tiền của.",
    69: "Mối quan hệ với đồng nghiệp, đối tác không tốt, gặp nhiều trở ngại trong công việc, sự nghiệp. Tình duyên trắc trở, hôn nhân bất hạnh, có thể dẫn tới li hôn.",
    70: "Số ít con ít cháu, không gặp may mắn trong cuộc sống. Cuộc sống hôn nhân không hạnh phúc, dễ rơi vào tình trạng tái hôn. Ngoài ra, chức năng thận và khả năng sinh đẻ kém.",
    71: "Đầu óc thông minh, sáng suốt, được nhiều quý nhân giúp đỡ.",
    72: "Gặp may mắn trong mọi phương diện của cuộc sống, hiếu thuận với cha mẹ, tuổi thọ cao, nhiều tiền của.",
    73: "Gặp nhiều điều may mắn, tài lộc dồi dào.",
    74: "Hiếu thuận với cha mẹ, tôn kính người bề trên.",
    75: "Có khiếu về nấu nướng.",
    76: "Tính tình cẩn trọng, tỉ mỉ, có số làm quản lý.",
    77: "Đề phòng mắc bệnh tật qua đường ăn uống và họa khẩu thiệt thị phi.",
    78: "Bệnh từ miệng mà ra, đề phòng mắc bệnh qua ăn uống. Ngoài ra, suy nghĩ kỹ càng trước khi nói, tránh họa khẩu thiệt thị phi."
  },
  female: {
    1: "Nốt ruồi đại phú quý, dễ lấy được chồng làm quan to.",
    2: "Số khắc chồng, cuộc sống hôn nhân bất hạnh, dễ phải tái hôn nhiều lần.",
    3: "Cản trở và gây bất lợi cho cha mẹ.",
    4: "Tính tình chăm chỉ, chi tiêu tiết kiệm, biết vun vén cho gia đình, làm việc gì cũng tận tâm tận lực.",
    5: "Hôn nhân bất hạnh, khá lận đận tình duyên, số phải tái hôn.",
    6: "Không mang lại lợi ích, thậm chí gây hại cho người thân.",
    7: "Mang đến điều bất lợi cho cha và chồng.",
    8: "Lấy chồng xa, núi sông cách trở, chết tại nơi đất khách quê người.",
    9: "Khắc chồng, cản trở sự nghiệp của chồng.",
    10: "Sức khỏe sinh sản kém, thường đau yếu bệnh tật, chửa đẻ khó khăn, nhiều khả năng sẽ chết vì bệnh tật.",
    11: "Gây bất lợi cho chồng, khó có được cuộc sống gia đình hạnh phúc, số phải sống cô độc.",
    12: "Nốt ruồi cát tường, mang lại nhiều may mắn.",
    13: "Số phải sống xa chồng, vợ chồng đau khổ vì xa cách.",
    14: "Mang điều bất lợi, xui xẻo cho chồng.",
    15: "Làm chuyện phạm pháp, dễ vướng vào vòng lao lí. Ngoài ra, thường làm những việc hại chồng, ngoại tình hoặc trộm cắp.",
    16: "Thích hợp với nghề trồng dâu nuôi tằm, dệt may, thời trang.",
    17: "Số ích tử, nuôi dạy con cái thành đạt, giỏi giang.",
    18: "Số vượng phu, trợ giúp đắc lực cho sự nghiệp của chồng.",
    19: "Gây bất lợi cho chồng, không trợ giúp công danh sự nghiệp của chồng.",
    20: "Sức khỏe tốt, ít đau yếu, bệnh tật, sống thọ.",
    21: "Ít may mắn trong cuộc sống, mắc nhiều bệnh tật, đề phòng tai họa liên quan đến lửa và nước.",
    22: "Có tật tắt mắt, hay lấy trộm đồ của người khác.",
    23: "Số mệnh cát tường, làm việc gì cũng thuận buồm xuôi gió.",
    24: "Tính lăng nhăng, đa tình, ham dục vọng.",
    25: "Số ít con cái, đặc biệt khó sinh được quý tử.",
    26: "Hay gặp phải những tai nạn bất ngờ, đề phòng tai họa từ lửa.",
    27: "Tướng người khá hung bạo khi nhìn từ vẻ bên ngoài. Tâm tư cũng nhiều phiền muộn, toan tính.",
    28: "Chi phối và cản trở cuộc sống của con cái khiến chúng suốt đời phiền não, sống trong sự lo sợ.",
    29: "Tình duyên trắc trở, cả đời phiền muộn vì chuyện tình yêu đôi lứa.",
    30: "Coi trọng hình thức, đào hoa, dục vọng cao.",
    31: "Không có tham vọng lớn nhưng làm việc gì cũng tới nơi tới chốn.",
    32: "Tâm tính đố kị, hay ghen ăn tức ở.",
    33: "Đề phòng bị chết đuối.",
    34: "Tướng người có khả năng sinh đôi. Tài vận trung bình, hôn nhân không hòa hợp, sức khỏe yếu kém, dễ mắc bệnh ở tử cung.",
    35: "Tâm địa độc ác tới mức có thể giết chết người thân, thậm chí chính con mình sinh ra.",
    36: "Thích lo chuyện bao đồng, 'lưỡi không xương nhiều đường lắt léo', hay gây chuyện thị phi, nói xấu sau lưng người khác.",
    37: "Gây trở ngại cho chồng, ít được chồng chiều chuộng.",
    38: "Hết lòng yêu thương và tôn trọng chồng, là mẫu hình vợ hiền lí tưởng. Ngoài ra, tâm hồn lãng mạn, tình cảm vợ chồng hài hòa, hạnh phúc.",
    39: "Đầu óc linh hoạt, thông minh tuyệt đỉnh.",
    40: "Đề phòng bị chết đuối.",
    41: "Sức khỏe yếu kém, mắc nhiều bệnh tật.",
    42: "Ít tiền của, đất đai, không giỏi quản lí cơ nghiệp của gia đình. Mối quan hệ với người thân không hòa hợp, hậu vận có cuộc sống đơn độc.",
    43: "Chèn ép, gây cản trở người bề dưới, cấp dưới. Có cơ hội phát triển sự nghiệp ở nơi đất khách quê người.",
    44: "Số mệnh giàu sang phú quý, họ hàng được nhờ cậy.",
    45: "Cản trở sự nghiệp của chồng, thậm chí giết chồng vì lợi ích nào đó.",
    46: "Tự làm hại bản thân.",
    47: "Thông minh, nổi trội và khá thành công trong sự nghiệp. Tuy nhiên, tình duyên trắc trở, cuộc sống vợ chồng không hòa hợp.",
    48: "Số vượng phu, trợ giúp đắc lực cho công danh, sự nghiệp và tiền tài của chồng.",
    49: "Mối quan hệ vợ chồng hòa hợp, gia đình hạnh phúc. Tuy nhiên, nhiều khả năng sẽ phạm đào hoa sát, tình cảm phải trải qua nhiều sóng gió mới được viên mãn.",
    50: "Khắc anh chị em, cuộc sống vợ chồng không hòa hợp, tình cảm hỗn loạn, gặp nhiều trắc trở.",
    51: "Thông minh, sự nghiệp thành đạt nhưng cần đề phòng 1 lần chết đuối hụt trong đời.",
    52: "Mối quan hệ vợ chồng lạnh nhạt, thường xuyên cãi vã, cuộc sống hôn nhân không hạnh phúc. Công danh sự nghiệp trung bình, dễ bị phá tài, tổn hao tài sản.",
    53: "Tài vận không tốt, kiếm được bao nhiêu tiền đều tiêu hết bấy nhiêu. Chuyện tình cảm phức tạp, các mối quan hệ khác giới hỗn loạn, dục vọng lớn, cuộc sống hôn nhân không hạnh phúc, dễ kết hôn nhiều lần.",
    54: "Nếu là nốt ruồi lành, đây là người có năng lực nhạy bén, khả năng tùy cơ ứng biến tốt. Từ sau trung vận, vận thế chuyển biến tốt, cuộc sống an lành. Nếu là nốt ruồi hung, người này có tư tưởng bất ổn, sự nghiệp khó phát triển. Ngoài ra, tính cách dâm đãng, dễ ngoại tình sau hôn nhân.",
    55: "Nếu là nốt ruồi lành, đây là người có năng lực nhạy bén, khả năng tùy cơ ứng biến tốt. Từ sau trung vận, vận thế chuyển biến tốt, cuộc sống an lành. Nếu là nốt ruồi hung, người này có tư tưởng bất ổn, sự nghiệp khó phát triển. Ngoài ra, tính cách dâm đãng, dễ ngoại tình sau hôn nhân.",
    56: "Thể trạng yếu, sức khỏe không tốt, dễ mắc bệnh về dạ dày.",
    57: "Đời sống tình cảm phong phú, đa sầu đa cảm, suốt đời hi sinh vì người khác nên được mọi người yêu mến, tài lộc dồi dào. Tuy nhiên, cần chú ý đến vấn đề ăn uống, tránh mắc bệnh tật.",
    58: "Có tài nấu nướng, biết chăm sóc quán xuyến gia đình. Tuy được chồng yêu mến nhưng vì phạm đào hoa sát, nên có thể rơi vào cuộc tình tay ba.",
    59: "Tài vận hưng vượng, số mệnh đại phúc đại quý, làm việc gì cũng gặp được quý nhân giúp đỡ. Tính tình cẩn trọng, làm việc chu đáo, tỉ mỉ, có đầu có cuối. Nhân duyên tốt, sinh hạ con gái nhiều hơn con trai.",
    60: "Thông minh lanh lợi, sau khi lập gia đình sẽ trở thành mẹ hiền vợ đảm, mang lại không khí hòa thuận và hạnh phúc trong gia đình.",
    61: "Sức khỏe không tốt, thể trạng yếu, hay mắc bệnh dạ dày. Cuộc sống hôn nhân không như ý, sinh hạ con gái nhiều hơn con trai và dễ bị phá tài.",
    62: "Tuổi thọ cao, có tài nấu nướng, suốt đời không phải lo cơm áo gạo tiền, sự nghiệp có người giúp đỡ. Tuy nhiên, tình duyên trắc trở, cuộc sống hôn nhân bất ổn."
  }
};

const analyzeType = (text) => {
  if (!text) return 'neutral';
  const lowerText = text.toLowerCase();
  
  const posWords = ['cát tường', 'phú quý', 'đại cát', 'tài vận', 'phát tài', 'giàu có', 'thuận buồm', 'làm quan', 'may mắn', 'thăng quan', 'sung túc', 'phúc lộc', 'khá giả', 'cát lợi', 'thông minh', 'thành đạt', 'vinh hoa', 'hạnh phúc', 'quyền lực', 'quý nhân', 'tuổi thọ', 'ích tử', 'vượng phu', 'thuận lợi', 'tiến thủ', 'thành công', 'giỏi giang', 'mẹ hiền', 'an lành', 'hòa thuận'];
  const negWords = ['nóng nảy', 'hung bạo', 'hại', 'bất lợi', 'bao đồng', 'chết', 'xui xẻo', 'tai nạn', 'cổ quái', 'tự sát', 'hoang phí', 'tán tài', 'độc ác', 'tàn nhẫn', 'đen tối', 'nan y', 'thất bại', 'ngang ngược', 'cản trở', 'trở ngại', 'hiếm muộn', 'phá tài', 'nghèo khó', 'khó dễ', 'thị phi', 'đào hoa sát', 'tay ba', 'trắc trở', 'kém', 'hãm hại', 'bôn ba', 'háo sắc', 'cô độc', 'cờ bạc', 'kiện tụng', 'tranh chấp', 'bệnh', 'khắc', 'lận đận', 'tái hôn', 'lao lí', 'phạm pháp', 'đố kị', 'phiền muộn', 'cãi vã', 'ly hôn', 'li hôn', 'khổ', 'chèn ép', 'tắt mắt'];

  let posScore = posWords.filter(w => lowerText.includes(w)).length;
  let negScore = negWords.filter(w => lowerText.includes(w)).length;

  if (posScore > negScore && negScore === 0) return 'positive';
  if (negScore > posScore && posScore === 0) return 'negative';
  if (posScore > 0 && negScore > 0) return 'neutral'; 
  
  if (posScore > negScore) return 'positive';
  if (negScore > posScore) return 'negative';
  return 'neutral';
};

const typeStyles = {
  positive: { icon: Smile, color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-500', dot: 'bg-green-500/40 border-green-500 hover:bg-green-600', label: 'Tích cực (Cát)' },
  negative: { icon: Frown, color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-500', dot: 'bg-red-500/40 border-red-500 hover:bg-red-600', label: 'Tiêu cực (Hung)' },
  neutral:  { icon: Meh, color: 'text-gray-600', bg: 'bg-gray-100', border: 'border-gray-500', dot: 'bg-gray-500/40 border-gray-500 hover:bg-gray-600', label: 'Hỗn hợp / Trung tính' }
};

const dotCoordinates = {
  male: [
    { id: 1, x: 50, y: 5 }, { id: 2, x: 42, y: 7 }, { id: 3, x: 58, y: 7 }, { id: 4, x: 50, y: 10 }, { id: 5, x: 35, y: 12 }, { id: 6, x: 65, y: 12 }, { id: 7, x: 45, y: 15 }, { id: 8, x: 55, y: 15 }, { id: 9, x: 25, y: 17 }, { id: 10, x: 75, y: 17 },
    { id: 11, x: 50, y: 18 }, { id: 12, x: 38, y: 20 }, { id: 13, x: 62, y: 20 }, { id: 14, x: 18, y: 22 }, { id: 15, x: 82, y: 22 }, { id: 16, x: 50, y: 24 }, { id: 17, x: 30, y: 25 }, { id: 18, x: 70, y: 25 }, { id: 19, x: 42, y: 28 }, { id: 20, x: 58, y: 28 },
    { id: 21, x: 22, y: 29 }, { id: 22, x: 78, y: 29 }, { id: 23, x: 50, y: 31 }, { id: 24, x: 35, y: 33 }, { id: 25, x: 65, y: 33 }, { id: 26, x: 45, y: 36 }, { id: 27, x: 55, y: 36 }, { id: 28, x: 25, y: 38 }, { id: 29, x: 75, y: 38 }, { id: 30, x: 50, y: 40 },
    { id: 31, x: 38, y: 42 }, { id: 32, x: 62, y: 42 }, { id: 33, x: 18, y: 44 }, { id: 34, x: 82, y: 44 }, { id: 35, x: 50, y: 46 }, { id: 36, x: 30, y: 48 }, { id: 37, x: 70, y: 48 }, { id: 38, x: 42, y: 51 }, { id: 39, x: 58, y: 51 }, { id: 40, x: 22, y: 53 },
    { id: 41, x: 78, y: 53 }, { id: 42, x: 50, y: 55 }, { id: 43, x: 35, y: 57 }, { id: 44, x: 65, y: 57 }, { id: 45, x: 45, y: 60 }, { id: 46, x: 55, y: 60 }, { id: 47, x: 25, y: 62 }, { id: 48, x: 75, y: 62 }, { id: 49, x: 50, y: 64 }, { id: 50, x: 38, y: 66 },
    { id: 51, x: 62, y: 66 }, { id: 52, x: 18, y: 68 }, { id: 53, x: 82, y: 68 }, { id: 54, x: 50, y: 70 }, { id: 55, x: 30, y: 72 }, { id: 56, x: 70, y: 72 }, { id: 57, x: 42, y: 75 }, { id: 58, x: 58, y: 75 }, { id: 59, x: 22, y: 77 }, { id: 60, x: 78, y: 77 },
    { id: 61, x: 50, y: 79 }, { id: 62, x: 35, y: 81 }, { id: 63, x: 65, y: 81 }, { id: 64, x: 45, y: 84 }, { id: 65, x: 55, y: 84 }, { id: 66, x: 25, y: 86 }, { id: 67, x: 75, y: 86 }, { id: 68, x: 50, y: 88 }, { id: 69, x: 38, y: 90 }, { id: 70, x: 62, y: 90 },
    { id: 71, x: 18, y: 92 }, { id: 72, x: 82, y: 92 }, { id: 73, x: 50, y: 94 }, { id: 74, x: 30, y: 95 }, { id: 75, x: 70, y: 95 }, { id: 76, x: 42, y: 97 }, { id: 77, x: 58, y: 97 }, { id: 78, x: 50, y: 98 }
  ],
  female: [
    { id: 1, x: 50, y: 6 }, { id: 2, x: 35, y: 8 }, { id: 3, x: 65, y: 8 }, { id: 4, x: 50, y: 11 }, { id: 5, x: 40, y: 14 }, { id: 6, x: 60, y: 14 }, { id: 7, x: 25, y: 16 }, { id: 8, x: 75, y: 16 }, { id: 9, x: 50, y: 18 }, { id: 10, x: 30, y: 20 },
    { id: 11, x: 70, y: 20 }, { id: 12, x: 45, y: 23 }, { id: 13, x: 55, y: 23 }, { id: 14, x: 18, y: 25 }, { id: 15, x: 82, y: 25 }, { id: 16, x: 50, y: 27 }, { id: 17, x: 38, y: 29 }, { id: 18, x: 62, y: 29 }, { id: 19, x: 22, y: 32 }, { id: 20, x: 78, y: 32 },
    { id: 21, x: 50, y: 34 }, { id: 22, x: 35, y: 36 }, { id: 23, x: 65, y: 36 }, { id: 24, x: 45, y: 39 }, { id: 25, x: 55, y: 39 }, { id: 26, x: 25, y: 41 }, { id: 27, x: 75, y: 41 }, { id: 28, x: 50, y: 43 }, { id: 29, x: 30, y: 45 }, { id: 30, x: 70, y: 45 },
    { id: 31, x: 40, y: 48 }, { id: 32, x: 60, y: 48 }, { id: 33, x: 18, y: 50 }, { id: 34, x: 82, y: 50 }, { id: 35, x: 50, y: 52 }, { id: 36, x: 38, y: 55 }, { id: 37, x: 62, y: 55 }, { id: 38, x: 22, y: 58 }, { id: 39, x: 78, y: 58 }, { id: 40, x: 50, y: 60 },
    { id: 41, x: 35, y: 62 }, { id: 42, x: 65, y: 62 }, { id: 43, x: 45, y: 65 }, { id: 44, x: 55, y: 65 }, { id: 45, x: 25, y: 67 }, { id: 46, x: 75, y: 67 }, { id: 47, x: 50, y: 69 }, { id: 48, x: 30, y: 72 }, { id: 49, x: 70, y: 72 }, { id: 50, x: 40, y: 75 },
    { id: 51, x: 60, y: 75 }, { id: 52, x: 18, y: 77 }, { id: 53, x: 82, y: 77 }, { id: 54, x: 50, y: 79 }, { id: 55, x: 38, y: 82 }, { id: 56, x: 62, y: 82 }, { id: 57, x: 22, y: 85 }, { id: 58, x: 78, y: 85 }, { id: 59, x: 50, y: 87 }, { id: 60, x: 35, y: 90 },
    { id: 61, x: 65, y: 90 }, { id: 62, x: 50, y: 93 }
  ]
};

const getMeaning = (gender, num) => {
  const parsedNum = parseInt(num);
  if (isNaN(parsedNum)) return null;
  const maxMoles = gender === 'male' ? 78 : 62;
  if (parsedNum < 1 || parsedNum > maxMoles) {
    return `Vui lòng nhập số từ 1 đến ${maxMoles} cho ${gender === 'male' ? 'Nam' : 'Nữ'}.`;
  }
  if (moleData[gender][parsedNum]) {
    return moleData[gender][parsedNum];
  }
  return `Vị trí nốt ruồi số ${parsedNum} của ${gender === 'male' ? 'Nam' : 'Nữ'}.`;
};

// Hàm hỗ trợ render markdown đơn giản
const renderMarkdown = (text) => {
  if (!text) return null;
  return text.split('\n').map((line, i) => {
    // Basic bold parser
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return (
      <p key={i} className="mb-2">
        {parts.map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} className="text-amber-900">{part.slice(2, -2)}</strong>;
          }
          if (part.startsWith('*') && part.endsWith('*')) {
             return <em key={j}>{part.slice(1, -1)}</em>;
          }
          return part;
        })}
      </p>
    );
  });
};

export default function App() {
  const [gender, setGender] = useState('male');
  const [searchNum, setSearchNum] = useState('');
  const [result, setResult] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [isMirrored, setIsMirrored] = useState(false);
  
  // States cho Profile & AI
  const [myMoles, setMyMoles] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState("");

  // Xóa hồ sơ khi đổi giới tính
  useEffect(() => {
    setMyMoles([]);
    setAiAnalysis("");
    setSearchNum('');
    setResult(null);
  }, [gender]);

  // States cho Edit Mode
  const [isEditMode, setIsEditMode] = useState(false);
  const [editDotId, setEditDotId] = useState(null);
  const [coords, setCoords] = useState(dotCoordinates);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchNum(val);
    if (val.trim() === '') {
      setResult(null);
      return;
    }
    setResult(getMeaning(gender, val));
  };

  const currentImage = gender === 'male' 
    ? 'https://cms.lichngaytot.com/medias/original/2021/8/24/not-ruoi-tren-mat-dan-ong.jpg' 
    : 'https://cms.lichngaytot.com/medias/original/2021/8/24/not-ruoi-tren-mat-phu-nu.jpg';

  const maxMoles = gender === 'male' ? 78 : 62;
  const currentResultType = analyzeType(result);
  const TypeIcon = typeStyles[currentResultType].icon;

  const isCurrentMoleInProfile = myMoles.some(m => m.id === searchNum);

  const toggleMoleInProfile = () => {
    if (!searchNum || !result || searchNum > maxMoles || searchNum < 1) return;
    
    if (isCurrentMoleInProfile) {
      setMyMoles(prev => prev.filter(m => m.id !== searchNum));
    } else {
      setMyMoles(prev => [...prev, { id: searchNum, meaning: result }]);
    }
    // Reset AI analysis khi hồ sơ thay đổi
    setAiAnalysis("");
  };

  const generateAIAnalysis = async () => {
    if (myMoles.length === 0) return;
    setIsGenerating(true);
    setAiAnalysis("");

    const apiKey = ""; // API Key được cấp tự động trong runtime môi trường
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const moleDescriptions = myMoles.map(m => `- Nốt ruồi số ${m.id}: ${m.meaning}`).join("\n");
    const prompt = `Tôi là ${gender === 'male' ? 'Nam giới' : 'Nữ giới'}. Theo nhân tướng học, trên khuôn mặt tôi có các nốt ruồi sau đây:\n\n${moleDescriptions}\n\nHãy đóng vai một chuyên gia phong thủy và nhân tướng học uyên bác. Dựa trên sự kết hợp của tất cả các nốt ruồi trên, hãy phân tích tổng quan về:\n1. Tính cách đặc trưng của tôi.\n2. Đường công danh, sự nghiệp và tài lộc.\n3. Đường tình duyên, gia đạo.\n4. Cuối cùng, đưa ra lời khuyên (cách phát huy những điểm tốt và cách hóa giải phong thủy/lối sống cho những điểm xấu).\n\nHãy viết một cách rõ ràng, mạch lạc, súc tích và sử dụng định dạng Markdown (in đậm các từ khóa quan trọng). Lời văn thân thiện, tích cực, không làm người đọc hoang mang.`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: "Bạn là một chuyên gia nhân tướng học uyên bác, thấu hiểu tâm lý con người. Luôn đưa ra những nhận định khách quan, kết hợp giữa thuật xem tướng cổ truyền và góc nhìn khoa học, tâm lý hiện đại. Lời khuyên luôn mang tính xây dựng, hướng thiện."}] }
    };

    try {
      let response;
      let retries = 5;
      let delay = 1000;
      
      for (let i = 0; i < retries; i++) {
          response = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
          });
          if (response.ok) break;
          await new Promise(r => setTimeout(r, delay));
          delay *= 2;
      }

      if (!response.ok) throw new Error("API call failed");
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      setAiAnalysis(text || "Không thể phân tích lúc này. Vui lòng thử lại.");
    } catch (err) {
      setAiAnalysis("Đã có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại sau.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDotClick = (e, id) => {
    e.stopPropagation();
    setSearchNum(id.toString());
    setResult(getMeaning(gender, id));
    if (isEditMode) {
      setEditDotId(id);
    }
  };

  const handleImageClick = (e) => {
    if (!isEditMode || !editDotId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    let x = ((e.clientX - rect.left) / rect.width) * 100;
    let y = ((e.clientY - rect.top) / rect.height) * 100;

    if (isMirrored) {
      x = 100 - x;
    }
    setCoords(prev => ({
      ...prev,
      [gender]: prev[gender].map(dot => 
        dot.id === editDotId ? { ...dot, x: parseFloat(x.toFixed(1)), y: parseFloat(y.toFixed(1)) } : dot
      )
    }));
  };

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(JSON.stringify(coords, null, 2));
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fdfaf6] font-sans text-gray-800 pb-10">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-amber-800 flex items-center gap-2">
            <UserCheck className="w-8 h-8" />
            Nhân Tướng Học AI
          </h1>
          
          <div className="flex gap-4 items-center flex-wrap justify-center">
            <button
              onClick={() => { setIsEditMode(!isEditMode); setEditDotId(null); }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-bold transition-all border-2 ${
                isEditMode ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50'
              }`}
              title="Bật chế độ chỉnh sửa tọa độ"
            >
              <Settings className="w-4 h-4" /> Debug
            </button>

            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setGender('male')}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
                  gender === 'male' ? 'bg-amber-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <User className="w-4 h-4" /> Nam (1-78)
              </button>
              <button
                onClick={() => setGender('female')}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
                  gender === 'female' ? 'bg-amber-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <User className="w-4 h-4" /> Nữ (1-62)
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8 flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Panel: Image & Guide */}
        <div className="lg:w-1/2 flex flex-col gap-4 w-full sticky top-28">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative overflow-hidden group">
            <div className="flex justify-between items-center mb-4 relative z-10">
              <div className="bg-amber-100 px-3 py-1 rounded-full text-xs font-bold text-amber-800 shadow-sm">
                Sơ đồ {gender === 'male' ? 'Nam' : 'Nữ'}
              </div>
              <button 
                onClick={() => setIsMirrored(!isMirrored)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all shadow-sm border ${
                  isMirrored ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <FlipHorizontal className="w-4 h-4" />
                {isMirrored ? 'Đang Lật (Soi Gương)' : 'Bản Gốc (Đối Diện)'}
              </button>
            </div>
            
            {/* Image Container */}
            <div className="relative w-full aspect-[3/4] bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center">
              {!imageError ? (
                <div 
                  className={`relative w-full h-full transition-transform duration-500 ${isMirrored ? 'scale-x-[-1]' : ''} ${isEditMode && editDotId ? 'cursor-crosshair' : ''}`}
                  onClick={handleImageClick}
                >
                  <img 
                    src={currentImage} 
                    alt={`Sơ đồ nốt ruồi ${gender === 'male' ? 'Nam' : 'Nữ'}`}
                    className="w-full h-full object-contain transition-transform duration-300"
                    onError={() => setImageError(true)}
                  />
                  {/* Overlay các điểm click */}
                  {coords[gender].map(dot => {
                    const dotDesc = moleData[gender][dot.id] || "";
                    const dotType = analyzeType(dotDesc);
                    const dotStyle = typeStyles[dotType].dot;
                    
                    const isActiveEdit = isEditMode && editDotId === dot.id;
                    const isSelectedInProfile = myMoles.some(m => m.id === dot.id.toString());
                    
                    return (
                      <button
                        key={dot.id}
                        onClick={(e) => handleDotClick(e, dot.id)}
                        className={`absolute w-3 h-3 -ml-[6px] -mt-[6px] rounded-full border transition-all flex items-center justify-center text-[6px] font-bold z-10 
                          ${isActiveEdit 
                            ? 'border-red-500 bg-red-500 text-white scale-[2.5] z-50 shadow-[0_0_10px_rgba(239,68,68,0.8)]' 
                            : isSelectedInProfile
                              ? 'border-purple-600 bg-purple-500 text-white scale-[1.5] z-40 shadow-[0_0_8px_rgba(168,85,247,0.8)] animate-pulse'
                              : `${dotStyle} text-transparent hover:scale-[2.5] hover:z-50 hover:text-white`
                          } 
                          ${isMirrored ? 'scale-x-[-1]' : ''}`}
                        style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
                        title={`Vị trí ${dot.id}`}
                      >
                        {dot.id}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center p-8 text-gray-500 flex flex-col items-center">
                      <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
                      <p>Không tải được ảnh sơ đồ.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 text-amber-900 text-sm">
            <h3 className="font-bold flex items-center gap-2 mb-2">
              <Pointer className="w-5 h-5 text-amber-600" /> Hướng dẫn:
            </h3>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>Đưa chuột hoặc bấm vào các điểm mờ để xem số.</li>
              <li>Bấm <strong>➕ Lưu vào hồ sơ</strong> ở từng nốt ruồi bạn có.</li>
              <li>Bấm <strong>✨ Phân Tích Tổng Quan (AI)</strong> để AI luận giải sự kết hợp các nốt ruồi của bạn.</li>
            </ul>
            <div className="flex flex-wrap gap-3 items-center pt-2 border-t border-amber-200">
              <span className="flex items-center gap-1 text-xs"><span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span> Tốt</span>
              <span className="flex items-center gap-1 text-xs"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> Xấu</span>
              <span className="flex items-center gap-1 text-xs"><span className="w-3 h-3 rounded-full bg-gray-500 inline-block"></span> Hỗn hợp</span>
              <span className="flex items-center gap-1 text-xs"><span className="w-3 h-3 rounded-full bg-purple-500 animate-pulse inline-block"></span> Của bạn</span>
            </div>
          </div>
        </div>

        {/* Right Panel: Interaction & AI */}
        <div className="lg:w-1/2 flex flex-col gap-6 w-full">
          
          {/* Search Box */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-shrink-0">
            <h2 className="text-xl font-bold mb-4">Tra cứu nhanh</h2>
            <div className="relative">
              <input
                type="number"
                min="1"
                max={maxMoles}
                value={searchNum}
                onChange={handleSearch}
                placeholder={`Nhập số từ 1 đến ${maxMoles}...`}
                className="w-full text-lg pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/20 transition-all"
              />
              <Search className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Result Area */}
          <div className={`rounded-2xl p-6 border-2 transition-all duration-300 flex-shrink-0 ${
            searchNum && result 
              ? `${typeStyles[currentResultType].bg} ${typeStyles[currentResultType].border}` 
              : 'bg-white border-dashed border-gray-200 flex items-center justify-center min-h-[160px]'
          }`}>
            {!searchNum ? (
              <div className="text-center text-gray-400 flex flex-col items-center">
                <AlertCircle className="w-12 h-12 mb-3 text-gray-300" />
                <p>Hãy chọn nốt ruồi trên ảnh để xem chi tiết.</p>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2">
                    <div className="inline-block px-3 py-1 bg-white rounded-lg text-sm font-bold text-gray-500 shadow-sm border">
                      Vị trí {searchNum}
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-bold bg-white shadow-sm border ${typeStyles[currentResultType].color} ${typeStyles[currentResultType].border}`}>
                      <TypeIcon className="w-4 h-4" />
                      {typeStyles[currentResultType].label}
                    </div>
                  </div>
                  
                  {/* Button Add to Profile */}
                  <button 
                    onClick={toggleMoleInProfile}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm transition-all border ${
                      isCurrentMoleInProfile 
                        ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
                        : 'bg-purple-600 text-white border-purple-700 hover:bg-purple-700 hover:shadow-md'
                    }`}
                  >
                    {isCurrentMoleInProfile ? <><Trash2 className="w-4 h-4"/> Bỏ lưu</> : <><Plus className="w-4 h-4"/> Lưu vào hồ sơ</>}
                  </button>
                </div>
                
                <h3 className="text-lg font-medium text-gray-800 leading-relaxed bg-white/60 p-4 rounded-xl shadow-sm border border-white/50">
                  {result}
                </h3>
              </div>
            )}
          </div>

          {/* AI Analysis Area / Profile */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 shadow-sm border border-purple-100 flex-grow">
            <h3 className="text-xl font-bold text-purple-900 flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" /> Hồ sơ cá nhân (AI)
            </h3>
            
            <div className="mb-4">
              {myMoles.length === 0 ? (
                <p className="text-sm text-purple-600/70 italic bg-white/50 p-3 rounded-lg border border-purple-100/50">
                  Bạn chưa chọn nốt ruồi nào. Hãy tìm và lưu nốt ruồi của bạn vào hồ sơ nhé.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {myMoles.map(m => (
                    <span key={m.id} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold border border-purple-200 shadow-sm">
                      Số {m.id}
                      <button onClick={(e) => { e.stopPropagation(); setSearchNum(m.id); setResult(m.meaning); toggleMoleInProfile(); }} className="ml-1 text-purple-400 hover:text-red-500">
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={generateAIAnalysis}
              disabled={myMoles.length === 0 || isGenerating}
              className={`w-full py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2 transition-all shadow-md ${
                myMoles.length === 0 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 hover:shadow-lg active:scale-[0.98]'
              }`}
            >
              {isGenerating ? <><Loader2 className="w-6 h-6 animate-spin" /> AI đang luận giải...</> : <>✨ Phân Tích Tổng Quan & Hóa Giải (AI)</>}
            </button>

            {/* AI Result Container */}
            {aiAnalysis && (
              <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border border-purple-100 text-gray-700 text-[15px] leading-relaxed relative">
                <div className="absolute -top-3 right-6 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Chuyên gia AI
                </div>
                <div className="prose prose-purple prose-sm max-w-none">
                  {renderMarkdown(aiAnalysis)}
                </div>
              </div>
            )}
          </div>

          {/* Edit Mode Panel (Hidden mostly unless Debug clicked) */}
          {isEditMode && (
             <div className="bg-red-50 rounded-2xl p-6 shadow-sm border border-red-100">
              <h3 className="text-lg font-bold text-red-800 flex items-center gap-2 mb-3">
                <Settings className="w-5 h-5" /> Chế Độ Căn Chỉnh Tọa Độ
              </h3>
              <div className="flex justify-between items-center mb-2 mt-6">
                <button onClick={handleCopyCoords} className="flex items-center gap-1 text-xs bg-white border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
                  {copySuccess ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />} Copy Data
                </button>
              </div>
              <textarea readOnly className="w-full h-32 text-[10px] font-mono p-3 rounded-lg border border-red-200" value={JSON.stringify(coords, null, 2)} />
            </div>
          )}

        </div>
      </main>
    </div>
  );
}