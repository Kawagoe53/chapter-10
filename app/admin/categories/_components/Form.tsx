import TextInput from "@/app/_components/TextInput";
import { CategoryRequestBody } from "@/app/_types/Posts";
import { useForm } from "react-hook-form";

type Props = {
  mode: "new" | "edit";
  onSubmit: (data: CategoryRequestBody) => Promise<void>;
  deleteHandleSubmit?: () => Promise<void>; //オプショナル AI 注意
  defaultValues: CategoryRequestBody;
};

export const Form = ({
  onSubmit,
  mode,
  deleteHandleSubmit,
  defaultValues,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryRequestBody>({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-6">
        <TextInput
          disabled={isSubmitting}
          label="カテゴリー名"
          {...register("name", {
            required: "入力必須です",
            maxLength: {
              value: 50,
              message: "50文字以内で入力してください",
            },
          })}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
        )}

        <button
          disabled={isSubmitting}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded self-end"
        >
          {mode == "new" ? "作成する" : "更新する"}
        </button>
        {mode == "edit" && (
          <button
            disabled={isSubmitting}
            onClick={deleteHandleSubmit}
            className="bg-red-500 hover:bg-red-200 text-white font-bold py-2 px-6 rounded self-end"
          >
            削除
          </button>
        )}
      </div>
    </form>
  );
};
