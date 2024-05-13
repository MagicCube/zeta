import { type Tool } from '~/shared/tools';
import { sleep } from '~/shared/utils/sleep';

export class SearchTool
  implements
    Tool<{
      organics: string[];
    }>
{
  readonly name = 'search';

  async run(params: string[]) {
    await sleep(1000);
    return {
      response: {
        keywords: params,
        organics: [
          '幕府将军的主角是柯斯莫·贾维斯。',
          '- 登場人物 编辑 · 约翰·布莱克索恩（威廉·亚当斯）：柯斯莫·賈維斯 · （德川家康，原作小說中人名為「吉井虎長」）：真田廣之 · （细川伽罗奢）：澤井杏奈（日语：澤井杏奈）',
        ],
      },
      content:
        '- 幕府将军的主角是柯斯莫·贾维斯。\n- 登場人物 编辑 · 约翰·布莱克索恩（威廉·亚当斯）：柯斯莫·賈維斯 · （德川家康，原作小說中人名為「吉井虎長」）：真田廣之 · （细川伽罗奢）：澤井杏奈（日语：澤井杏奈）',
    };
  }
}
