/**
 * 证据缺口规则库
 * 场景类型: edu, medical, estate, consumer, prepay, labor, loan, invest, property, traffic, other
 * 争议焦点: 每种scene各有3-5个
 * 已有材料: contract, payment, chat, photo, receipt, certificate, other
 */

const evidenceGapRules = {
  edu: {
    '退款难': {
      missing: ['chat', 'receipt'],
      getWay: {
        chat: '微信聊天记录导出，重点截取签约前的承诺与签约后的协商内容',
        receipt: '要求机构开具正式收据或发票，注明"不退款"条款需特别标注'
      },
      whyNeed: {
        chat: '呈现双方就退费事宜的完整沟通过程，证明已主动协商',
        receipt: '证明实际付款金额及付款时间，作为退款金额计算的依据'
      }
    },
    '宣传失实': {
      missing: ['chat', 'photo', 'certificate'],
      getWay: {
        chat: '微信公众号历史文章、招生简章、销售人员朋友圈截图',
        photo: '培训现场照片、教室环境、师资介绍展板等宣传材料',
        certificate: '要求机构提供教师资质证书、办学许可证等'
      },
      whyNeed: {
        chat: '记录"名师授课"、"包过班"等具体的承诺性表述',
        photo: '证明实际教学环境与宣传不符',
        certificate: '证明机构不具备宣称的教学资质'
      }
    },
    '教学质量差': {
      missing: ['chat', 'photo', 'certificate'],
      getWay: {
        chat: '与培训机构负责人的沟通记录，指出教学问题',
        photo: '拍摄课堂实际情况，与宣传资料对比',
        certificate: '教师资质证明、课程大纲'
      },
      whyNeed: {
        chat: '证明曾向机构反映问题，机构未改善',
        photo: '直观呈现教学环境的真实情况',
        certificate: '证明教师不具备相应教学资质'
      }
    },
    '合同霸王条款': {
      missing: ['contract', 'chat'],
      getWay: {
        chat: '签约前的沟通记录，证明协商过程',
        contract: '获取完整合同原件，特别关注格式条款'
      },
      whyNeed: {
        chat: '证明签约时弱势地位，条款未经充分协商',
        contract: '作为主张条款无效的核心证据'
      }
    }
  },

  medical: {
    '过度医疗': {
      missing: ['certificate', 'receipt', 'chat'],
      getWay: {
        certificate: '获取原始病历、诊断证明、检验报告',
        receipt: '打印医疗费用明细清单及正式发票',
        chat: '与主治医生的沟通记录，特别是推荐检查/治疗的理由'
      },
      whyNeed: {
        certificate: '证明实际诊疗过程与诊断是否匹配',
        receipt: '证明医疗费用合理性，找出不合理收费项目',
        chat: '证明医生推荐某些检查/治疗时的说辞'
      }
    },
    '误诊漏诊': {
      missing: ['certificate', 'photo', 'chat'],
      getWay: {
        certificate: '获取其他医院的诊断证明、复查报告',
        photo: '拍摄患处照片或提供检查影像资料',
        chat: '与医生的沟通记录，特别是诊断依据的说明'
      },
      whyNeed: {
        certificate: '与误诊结果形成对比，证明存在误诊',
        photo: '直观展示病情实际情况',
        chat: '证明医生未充分了解病情或未进行必要检查'
      }
    },
    '手术失败': {
      missing: ['certificate', 'photo', 'chat'],
      getWay: {
        certificate: '获取手术记录、麻醉记录、术后恢复记录',
        photo: '拍摄术后伤口愈合情况、并发症表现',
        chat: '与主刀医生及院方的沟通记录'
      },
      whyNeed: {
        certificate: '证明手术过程是否符合规范',
        photo: '直观呈现手术后果',
        chat: '证明术后出现异常时机构的处理态度'
      }
    },
    '隐私泄露': {
      missing: ['chat', 'receipt', 'photo'],
      getWay: {
        chat: '相关人员承认或暗示泄露行为的聊天记录',
        receipt: '证明曾向该医疗机构提供过个人信息',
        photo: '泄露信息的相关截图或传播证据'
      },
      whyNeed: {
        chat: '证明泄露事实及泄露主体',
        receipt: '建立隐私信息与医疗机构的关联',
        photo: '证明信息泄露后造成的实际影响'
      }
    }
  },

  estate: {
    '房屋质量问题': {
      missing: ['photo', 'certificate', 'chat'],
      getWay: {
        photo: '拍摄房屋裂缝、渗水、脱落等质量问题全景及特写',
        certificate: '获取房屋质量检测报告、建筑材料合格证明',
        chat: '与开发商/物业的沟通记录，特别是报修记录'
      },
      whyNeed: {
        photo: '直观呈现房屋质量问题的实际状况',
        certificate: '证明质量问题超出正常使用标准',
        chat: '证明开发商知晓问题且未及时修复'
      }
    },
    '延期交房': {
      missing: ['contract', 'chat', 'receipt'],
      getWay: {
        contract: '商品房买卖合同，重点关注交房日期及违约条款',
        chat: '开发商关于延期交房原因、交付时间的通知及沟通',
        receipt: '已支付房款的凭证，按揭合同等'
      },
      whyNeed: {
        contract: '作为主张延期违约的核心依据',
        chat: '证明开发商承认延期事实及承诺的交付时间',
        receipt: '证明已履行付款义务，有权主张交房'
      }
    },
    '虚假宣传': {
      missing: ['chat', 'photo', 'certificate'],
      getWay: {
        chat: '楼盘宣传资料、户型图、沙盘照片、销售人员承诺的聊天记录',
        photo: '样板间照片与实际交房情况的对比',
        certificate: '规划变更审批文件、产证登记信息'
      },
      whyNeed: {
        chat: '记录销售时的具体承诺',
        photo: '证明实际交付与宣传不符',
        certificate: '证明规划变更未及时告知业主'
      }
    },
    '物业纠纷': {
      missing: ['contract', 'receipt', 'chat'],
      getWay: {
        contract: '物业服务合同、业主公约',
        receipt: '物业费缴纳凭证、公共维修基金使用明细',
        chat: '与物业沟通质量问题、费用争议的记录'
      },
      whyNeed: {
        contract: '明确物业服务标准及收费标准',
        receipt: '证明已按时缴纳物业费',
        chat: '证明物业服务不达标或存在收费不合理'
      }
    }
  },

  consumer: {
    '假冒伪劣': {
      missing: ['photo', 'receipt', 'certificate'],
      getWay: {
        photo: '拍摄商品瑕疵部位、假冒标识、与正品对比照',
        receipt: '购物发票、小票、支付记录',
        certificate: '品牌方鉴定报告、产品质量检测报告'
      },
      whyNeed: {
        photo: '直观展示商品与正品的差异',
        receipt: '证明购买事实及购买渠道',
        certificate: '证明商品为假冒伪劣'
      }
    },
    '价格欺诈': {
      missing: ['photo', 'receipt', 'chat'],
      getWay: {
        photo: '拍摄标价牌、促销海报、价签',
        receipt: '购物小票、发票，显示实际收款金额',
        chat: '与商家沟通价格时的录音或聊天记录'
      },
      whyNeed: {
        photo: '证明标价与实际收费的差异',
        receipt: '证明实际付款金额及收费项目',
        chat: '证明商家知晓价格错误或故意欺诈'
      }
    },
    '虚假促销': {
      missing: ['photo', 'chat', 'receipt'],
      getWay: {
        photo: '促销活动宣传海报、广告截图',
        chat: '活动规则说明、与客服沟通记录',
        receipt: '购买凭证，证明"优惠价"实际未优惠'
      },
      whyNeed: {
        photo: '记录促销宣传的具体内容',
        chat: '证明活动规则与实际执行不一致',
        receipt: '证明实际成交价与宣称优惠不符'
      }
    },
    '预付卡跑路': {
      missing: ['contract', 'receipt', 'chat'],
      getWay: {
        contract: '预付卡购买协议、会员卡办理合同',
        receipt: '充值凭证、消费记录、卡内余额证明',
        chat: '与商家沟通退款或联系不上时的记录'
      },
      whyNeed: {
        contract: '明确服务内容、有效期、退卡条款',
        receipt: '证明已付款金额及剩余金额',
        chat: '证明商家关门前后的沟通情况'
      }
    }
  },

  prepay: {
    '健身房卷款跑路': {
      missing: ['contract', 'receipt', 'chat'],
      getWay: {
        contract: '健身合同、私教协议',
        receipt: '会员卡购买/充值凭证、消费记录',
        chat: '与教练/工作人员沟通记录、维权群聊天'
      },
      whyNeed: {
        contract: '明确服务期限、会籍类型',
        receipt: '证明已付款金额及卡内余额',
        chat: '证明商家关闭前后的沟通情况及负责人态度'
      }
    },
    '教育机构倒闭': {
      missing: ['contract', 'receipt', 'chat'],
      getWay: {
        contract: '培训协议、课程购买合同',
        receipt: '学费支付凭证、发票',
        chat: '与机构老师、行政人员的沟通记录'
      },
      whyNeed: {
        contract: '明确剩余课时、合同期限',
        receipt: '证明已付款金额及未消耗课时价值',
        chat: '证明机构关闭前的经营异常迹象'
      }
    },
    '美容院跑路': {
      missing: ['contract', 'receipt', 'photo'],
      getWay: {
        contract: '美容服务协议、产品购买合同',
        receipt: '会员卡充值凭证、消费小票',
        photo: '店铺现状照片、会员群截图'
      },
      whyNeed: {
        contract: '明确服务内容、有效期',
        receipt: '证明卡内余额',
        photo: '证明商家已关门停业'
      }
    },
    '共享单车押金难退': {
      missing: ['receipt', 'chat'],
      getWay: {
        receipt: '押金缴纳支付记录、账户余额截图',
        chat: '多次联系客服的沟通记录、退款申请记录'
      },
      whyNeed: {
        receipt: '证明已缴纳押金金额',
        chat: '证明已按流程申请退款，平台超期未处理'
      }
    }
  },

  labor: {
    '拖欠工资': {
      missing: ['contract', 'receipt', 'chat'],
      getWay: {
        contract: '劳动合同、工资发放约定',
        receipt: '银行流水、工资条、社保缴纳记录',
        chat: '与老板/HR沟通工资发放的记录'
      },
      whyNeed: {
        contract: '明确工资标准、发放时间',
        receipt: '证明工资实际发放情况',
        chat: '证明拖欠事实及讨薪过程'
      }
    },
    '违法解除': {
      missing: ['contract', 'chat', 'certificate'],
      getWay: {
        contract: '劳动合同、岗位职责说明、绩效考核标准',
        chat: '与领导/HR关于工作表现、离职原因的沟通',
        certificate: '公司出具的解除劳动合同通知书'
      },
      whyNeed: {
        contract: '明确合同期限、工作内容',
        chat: '证明解除原因及过程',
        certificate: '证明解除事实及解除理由'
      }
    },
    '工伤认定争议': {
      missing: ['certificate', 'photo', 'chat'],
      getWay: {
        certificate: '工伤认定决定书、医疗诊断证明、劳动能力鉴定',
        photo: '事故现场照片、工作环境照片',
        chat: '与同事、上级关于事故经过的沟通记录'
      },
      whyNeed: {
        certificate: '证明工伤事实及伤残等级',
        photo: '还原事故现场情况',
        chat: '证明事故经过及工作时间、环境'
      }
    },
    '未签合同': {
      missing: ['receipt', 'chat', 'photo'],
      getWay: {
        receipt: '工资发放记录、社保缴纳记录',
        chat: '工作安排、汇报的沟通记录',
        photo: '工作证、门禁卡、名片、工作场景照'
      },
      whyNeed: {
        receipt: '证明实际用工关系及工资标准',
        chat: '证明存在事实劳动关系',
        photo: '证明实际工作内容及工作环境'
      }
    }
  },

  loan: {
    '砍头息': {
      missing: ['contract', 'receipt', 'chat'],
      getWay: {
        contract: '借款合同，重点关注借款金额、利率、还款方式',
        receipt: '实际到账金额的银行流水，与合同金额对比',
        chat: '与贷款专员沟通的记录，特别是"手续费""服务费"等说辞'
      },
      whyNeed: {
        contract: '证明合同约定的借款金额',
        receipt: '证明实际到手金额与合同不符',
        chat: '证明存在砍头息的事实及贷款方知情'
      }
    },
    '高利贷': {
      missing: ['contract', 'receipt', 'chat'],
      getWay: {
        contract: '借款协议，明确利率、费用条款',
        receipt: '已还款金额的银行流水、还款计划表',
        chat: '与催收人员的沟通记录，特别是暴力催收证据'
      },
      whyNeed: {
        contract: '证明约定利率超过法定上限',
        receipt: '证明已还款金额及尚未偿还的真实本金',
        chat: '证明存在暴力催收或变相高息'
      }
    },
    '套路贷': {
      missing: ['contract', 'chat', 'photo'],
      getWay: {
        contract: '所有签订的借款合同、空白合同',
        chat: '与贷款方的沟通记录，特别是平账、转单过程',
        photo: '贷款方公司名称、标识、工作人员信息'
      },
      whyNeed: {
        contract: '证明存在空白合同、伪造债务',
        chat: '证明存在"平账""转单"等套路操作',
        photo: '证明贷款方身份及公司信息'
      }
    },
    '暴力催收': {
      missing: ['chat', 'photo', 'certificate'],
      getWay: {
        chat: '催收电话录音、短信、微信威胁记录',
        photo: '被喷漆、堵门、骚扰的照片',
        certificate: '报警回执、医院诊断证明（如有受伤）'
      },
      whyNeed: {
        chat: '证明催收方式违法及威胁内容',
        photo: '直观展示暴力催收行为',
        certificate: '证明暴力催收造成的人身伤害'
      }
    }
  },

  invest: {
    '非法集资': {
      missing: ['contract', 'receipt', 'chat'],
      getWay: {
        contract: '投资协议、股权认购协议、理财合同',
        receipt: '投资款支付凭证、收益分配记录',
        chat: '与项目方/经纪人的沟通记录，特别是高收益承诺'
      },
      whyNeed: {
        contract: '证明投资关系及约定的收益方式',
        receipt: '证明实际投资金额',
        chat: '证明存在虚假宣传、承诺保本保息'
      }
    },
    '虚假宣传诱导投资': {
      missing: ['chat', 'photo', 'certificate'],
      getWay: {
        chat: '销售人员承诺收益的聊天记录、朋友圈宣传截图',
        photo: '项目宣传册、现场活动照片',
        certificate: '相关资质证书、备案文件'
      },
      whyNeed: {
        chat: '记录销售人员承诺高收益的具体表述',
        photo: '证明宣传材料中的承诺',
        certificate: '证明项目方不具备相应资质'
      }
    },
    '合同违约': {
      missing: ['contract', 'receipt', 'chat'],
      getWay: {
        contract: '投资合同、合伙协议',
        receipt: '出资凭证、收益到账记录',
        chat: '与项目方的沟通记录，特别是违约后的协商'
      },
      whyNeed: {
        contract: '明确合同约定的权利义务',
        receipt: '证明已履行出资义务',
        chat: '证明项目方违约事实及态度'
      }
    },
    '资金链断裂': {
      missing: ['certificate', 'chat', 'receipt'],
      getWay: {
        certificate: '公司财务报表、审计报告、工商登记信息',
        chat: '与公司负责人的沟通记录',
        receipt: '投资款支付及回收情况'
      },
      whyNeed: {
        certificate: '证明公司实际经营状况',
        chat: '证明公司负责人对资金问题的态度',
        receipt: '证明实际损失金额'
      }
    }
  },

  property: {
    '车位强买强卖': {
      missing: ['contract', 'chat', 'photo'],
      getWay: {
        contract: '车位购买/租赁合同、不合理条款',
        chat: '与开发商/物业沟通的记录，特别是捆绑销售证据',
        photo: '小区车位公告、通知'
      },
      whyNeed: {
        contract: '证明存在强制交易条款',
        chat: '证明业主被要求"先买车位再交房"',
        photo: '证明开发商的强制性规定'
      }
    },
    '违规改建': {
      missing: ['photo', 'certificate', 'chat'],
      getWay: {
        photo: '违规改建现场照片、与规划设计对比',
        certificate: '建设工程规划许可证、竣工验收报告',
        chat: '向物业/城管投诉的记录'
      },
      whyNeed: {
        photo: '直观展示违规改建情况',
        certificate: '证明原规划审批内容',
        chat: '证明违规事实及投诉经过'
      }
    },
    '相邻权纠纷': {
      missing: ['photo', 'chat', 'certificate'],
      getWay: {
        photo: '拍摄相邻方侵权事实（噪音、漏水、违建等）',
        chat: '与相邻方的沟通记录、居委会调解记录',
        certificate: '房屋产权证、原始户型图'
      },
      whyNeed: {
        photo: '证明侵权事实的具体表现',
        chat: '证明已尝试协商解决',
        certificate: '明确房屋边界及产权范围'
      }
    },
    '物业费争议': {
      missing: ['contract', 'receipt', 'chat'],
      getWay: {
        contract: '物业服务合同、收费标准',
        receipt: '物业费缴纳记录、服务质量记录',
        chat: '与物业沟通服务不达标的记录'
      },
      whyNeed: {
        contract: '明确收费标准和服务标准',
        receipt: '证明已缴费及欠费金额',
        chat: '证明物业服务存在瑕疵'
      }
    }
  },

  traffic: {
    '车险理赔难': {
      missing: ['contract', 'photo', 'chat'],
      getWay: {
        contract: '保险单、保险条款、报案记录',
        photo: '事故现场照片、车辆损失照片',
        chat: '与保险公司沟通理赔的记录，特别是拒赔理由'
      },
      whyNeed: {
        contract: '证明保险责任范围',
        photo: '证明事故及损失情况',
        chat: '证明理赔被拒的具体理由'
      }
    },
    '交通事故责任认定': {
      missing: ['photo', 'certificate', 'chat'],
      getWay: {
        photo: '事故现场照片、刹车痕迹、碰撞部位',
        certificate: '道路交通事故认定书、车辆检测报告',
        chat: '与对方司机/交警的沟通记录'
      },
      whyNeed: {
        photo: '还原事故现场情况',
        certificate: '证明责任认定的依据',
        chat: '证明事故处理过程'
      }
    },
    '维修质量争议': {
      missing: ['photo', 'certificate', 'chat'],
      getWay: {
        photo: '维修前后的车辆照片对比',
        certificate: '维修清单、更换配件清单、质量检测报告',
        chat: '与4S店/维修厂的沟通记录'
      },
      whyNeed: {
        photo: '证明维修后仍存在问题',
        certificate: '证明更换的配件及维修项目',
        chat: '证明维修质量问题及沟通过程'
      }
    },
    '代驾纠纷': {
      missing: ['chat', 'photo', 'receipt'],
      getWay: {
        chat: '代驾APP订单记录、与代驾员的沟通',
        photo: '事故现场照片、车辆损坏照片',
        receipt: '代驾费用支付记录'
      },
      whyNeed: {
        chat: '证明代驾关系及事故发生时的情形',
        photo: '证明车辆损坏情况',
        receipt: '证明已支付代驾费用'
      }
    }
  },

  other: {
    '默认争议': {
      missing: ['contract', 'chat', 'receipt'],
      getWay: {
        contract: '涉及的合同、协议、约定',
        chat: '双方沟通的相关记录',
        receipt: '付款凭证、发票、收据'
      },
      whyNeed: {
        contract: '明确双方权利义务',
        chat: '呈现沟通经过及争议焦点',
        receipt: '证明实际履行情况'
      }
    }
  }
}

/**
 * 获取证据缺口分析
 * @param {string} scene - 场景类型: edu, medical, estate, consumer, prepay, labor, loan, invest, property, traffic, other
 * @param {string} dispute - 争议焦点/纠纷类型
 * @param {string[]} owned - 已有的证据材料数组: contract, payment, chat, photo, receipt, certificate, other
 * @returns {Object} { missing: string[], getWay: Record<string, string>, whyNeed: Record<string, string> }
 */
export function getEvidenceGap(scene, dispute, owned) {
  const rules = evidenceGapRules[scene] || evidenceGapRules.other
  const rule = rules[dispute] || Object.values(rules)[0]
  
  if (!rule) {
    return {
      missing: [],
      getWay: {},
      whyNeed: {}
    }
  }
  
  const allMissing = rule.missing.filter(m => owned.indexOf(m) === -1)
  
  return {
    missing: allMissing,
    getWay: allMissing.reduce((acc, m) => ({ ...acc, [m]: rule.getWay[m] || '' }), {}),
    whyNeed: allMissing.reduce((acc, m) => ({ ...acc, [m]: rule.whyNeed[m] || '' }), {})
  }
}

export default evidenceGapRules